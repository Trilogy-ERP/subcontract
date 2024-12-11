# Copyright (c) 2024, aya and contributors
# For license information, please see license.txt

# import frappe


# def execute(filters=None):
# 	columns, data = [], []
# 	return columns, data


# import frappe

import frappe

def execute(filters=None):
    # إعداد الأعمدة في التقرير
    columns = [
        {
            "label": "Contract Name",
            "fieldname": "contract_name",
            "fieldtype": "Data",
            "width": 200
        },
        {
            "label": "Total Amount",
            "fieldname": "total_amount",
            "fieldtype": "Currency",
            "width": 150
        }
    ]
    
    # البيانات النهائية
    data = []
    
    # جلب جميع العقود من DocType Contracts
    contracts = frappe.get_all("Contracts", fields=["name"])

    for contract in contracts:
        # جلب تفاصيل العناصر من الجدول الفرعي table_itfa
        contract_doc = frappe.get_doc("Contracts", contract.name)
        
        total_amount = 0
        for item in contract_doc.table_itfa:
            total_amount += item.amount
        
        # إضافة البيانات إلى التقرير
        data.append({
            "contract_name": contract.name,
            "total_amount": total_amount
        })
    
    return columns, data



