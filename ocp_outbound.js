(function execute(inputs, outputs) {
    function convertToBase(data) {
        const cleanInputs = {};
        for (const [key, value, toLower] of data) {
            let str = String(value ?? '');
            if (toLower) str = str.toLowerCase();
            cleanInputs[key] = str;
        }
        return cleanInputs;
    }
    /**
     * Variables sent to Containerplatform
     * Type of action: [create|modify|reload|delete]
     * Cluster name
     * Namespace
     * PLacement group
     * Workload type
     * Project name
     * Cluster size
     * Storage size
     *
     * Application ID
     */

    /**
     * Add fields here that are sent in input
     */
    const fieldsToExtract = [
        ['taskTyp', inputs.action, true],
        ['desiredEnvironment', inputs.environment, true], // convert to lowerCase
        ['clusterName', inputs.clustername],
        ['applicationID', inputs.applicationid],
        ['placementGroup', inputs.placementgroupname],
        ['projectName', inputs.projectname],
        ['adjustNamespace', inputs.namespace]
    ];

    let skvJSON = false;

    // Collect data from OCP Cluster Configuration
    const ocp = new GlideRecord("u_skv_ocp_cluster_configuration");
    ocp.addQuery("u_name", inputs.clustername);
    ocp.orderByDesc('sys_created_on');
    ocp.setLimit(1);
    ocp.query();
    if (ocp.next()) {
        fieldsToExtract.push(
            ['workLoadType', ocp.getValue('u_workload_type')],
            ['hostAddress', ocp.getValue('u_bastion_fqdn')],
            ['fullPath', ocp.getValue('u_bastion_cli_path')]
        );
        skvJSON = ocp.u_aiml_konfiguration ? ocp.u_aiml_konfiguration.toString() : '';
    }

    const baseData = convertToBase(fieldsToExtract);
    if (baseData.fullPath) {
        baseData.fullPath = 'sudo ' + baseData.fullPath;
    }

    if (baseData.taskType === 'create') {
        // Build Projectname from ApplicationID and desired project name
        if (baseData.applicationID && baseData.projectName) {
            baseData.projectFullName = baseData.applicationID + '-' + baseData.projectName;
            if (baseData.desiredEnvironment !== 'pro' && baseData.desiredEnvironment) {
                baseData.projectFullName += '-' + baseData.desiredEnvironment;
            }
        } else {
            return;
        }
    } else if (baseData.adjustedNameSpace) {
        const environmentLength = baseData.desiredEnvironment.length + 1;
        baseData.projectFullName = baseData.adjustedNameSpace.substring(0, baseData.adjustedNameSpace.length - environmentLength);
    } else {
        return;
    }
    if (!skvJSON) {
        let callLine = '';
        callLine += ' --task ' + baseData.taskType;
        callLine += ' --cluster ' + baseData.clusterName;
        callLine += ' --owner ' + baseData.applicationID;
        callLine += ' --namespace ' + baseData.projectFullName;
        callLine += ' --compute-size ' + inputs.computesize;
        callLine += ' --storage-size ' + inputs.storagesize;
        callLine += ' --workload-type ' + baseData.workLoadType;
        callLine += ' --placement-group ' + baseData.placementGroup;
        outputs.cmdstring = baseData.fullPath + callLine;
        outputs.host = baseData.hostAddress;
    } else {
        /**
         * Take JSON data from the cluster record
         * JSON data on cluster record managed by AIML team
         */

        let callCarrousel = '';
        try {
            const dataJSON = JSON.parse(skvJSON);

        } catch (carrouselError) {
            gs.error(carrouselError.message);
        }

        outputs.cmdstring = baseData.fullPath + callCarrousel;
        outputs.host = baseData.hostAddress;
    }

})(inputs, outputs);
