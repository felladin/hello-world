/**
 * Script to create the vacation schedule table
 * Run this in ServiceNow Script Background
 * Author: felladin
 * Created: 2025-08-21 08:29:03
 */

// Create the vacation schedule table
var tableName = 'u_vacation_schedule';

// Check if table already exists
var table = new GlideRecord('sys_db_object');
table.addQuery('name', tableName);
table.query();

if (!table.next()) {
    // Create the table
    var tableRecord = new GlideRecord('sys_db_object');
    tableRecord.initialize();
    tableRecord.setValue('name', tableName);
    tableRecord.setValue('label', 'Vacation Schedule');
    tableRecord.setValue('is_extendable', false);
    tableRecord.setValue('live_feed_enabled', false);
    tableRecord.setValue('number_ref', '');
    tableRecord.setValue('provider_class', '');
    tableRecord.setValue('scope', 'global');
    tableRecord.setValue('sys_class_name', 'sys_db_object');
    tableRecord.setValue('sys_package', '');
    var tableId = tableRecord.insert();
    
    gs.info('Created table: ' + tableName);
    
    // Create fields
    var fields = [
        {
            column_label: 'User',
            column_name: 'u_user',
            internal_type: 'reference',
            reference: 'sys_user',
            mandatory: true
        },
        {
            column_label: 'Start Date',
            column_name: 'u_start_date',
            internal_type: 'glide_date',
            mandatory: true
        },
        {
            column_label: 'End Date', 
            column_name: 'u_end_date',
            internal_type: 'glide_date',
            mandatory: true
        },
        {
            column_label: 'Description',
            column_name: 'u_description',
            internal_type: 'string',
            max_length: 255
        },
        {
            column_label: 'Type',
            column_name: 'u_type',
            internal_type: 'choice',
            choice: 'vacation,sick,personal,other'
        },
        {
            column_label: 'Status',
            column_name: 'u_status',
            internal_type: 'choice',
            choice: 'pending,approved,rejected',
            default_value: 'pending'
        }
    ];
    
    fields.forEach(function(fieldData) {
        var field = new GlideRecord('sys_dictionary');
        field.initialize();
        field.setValue('name', tableName);
        field.setValue('column_label', fieldData.column_label);
        field.setValue('column_name', fieldData.column_name);
        field.setValue('internal_type', fieldData.internal_type);
        
        if (fieldData.reference) {
            field.setValue('reference', fieldData.reference);
        }
        
        if (fieldData.mandatory) {
            field.setValue('mandatory', fieldData.mandatory);
        }
        
        if (fieldData.max_length) {
            field.setValue('max_length', fieldData.max_length);
        }
        
        if (fieldData.choice) {
            field.setValue('choice', fieldData.choice);
        }
        
        if (fieldData.default_value) {
            field.setValue('default_value', fieldData.default_value);
        }
        
        field.insert();
        gs.info('Created field: ' + fieldData.column_name);
    });
    
} else {
    gs.info('Table ' + tableName + ' already exists');
}
