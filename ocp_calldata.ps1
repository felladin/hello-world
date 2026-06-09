Mandatory parameters:
  --operation [create|modify|reload|delete]
  --namespace
  --cluster
  --workload-type

Mandatory parameters only when creating new configuration:
  --placement-group

Optional parameters:
  --resource-quota-cpu-request
  --resource-quota-cpu-limit
  --resource-quota-memory-request
  --resource-quota-memory-limit
  --resource-quota-storage-request
  --resource-quota-ephemeral-storage-request
  --resource-quota-ephemeral-storage-limit
  --resource-quota-persistent-volume-claims
  --resource-quota-max-pod-count
  --resource-quota-gpu-request
  --limit-range-pod-cpu-max
  --limit-range-pod-memory-max
  --limit-range-container-cpu-max
  --limit-range-container-memory-max
  --limit-range-ephemeral-storage-max
  --custom-label-name-1
  --custom-label-value-1
  --custom-label-name-2
  --custom-label-value-2
  --custom-label-name-3
  --custom-label-value-3
  --custom-label-name-4
  --custom-label-value-4
  --custom-label-name-5
  --custom-label-value-5

Usage examples:
  configure-namespace.sh --operation create --namespace foo-bar-utv --cluster c06.ocp.test.skv.se --placement-group foobar-quxbax --workload-type ocpstatels
  configure-namespace.sh --operation modify --namespace foo-bar-utv --cluster c06.ocp.test.skv.se --workload-type ocpstatels --resource-quota-max-pod-count 39
  configure-namespace.sh --operation reload --namespace foo-bar-utv --cluster c06.ocp.test.skv.se --workload-type ocpstatels
  configure-namespace.sh --operation delete --namespace foo-bar-utv --cluster c06.ocp.test.skv.se --workload-type ocpstatels