// Copyright (c) 2024, aya and contributors
// For license information, please see license.txt

// frappe.query_reports["Clearance"] = {
// 	"filters": [

// 	]
// };

frappe.query_reports["Clearance"] = {
    "filters": [
        {
            "fieldname": "contract_name",
            "label": __("Contract Name"),
            "fieldtype": "Link",
            "options": "Contracts",
            "default": "",
            "reqd": 0
        }
    ]
};



