# Copyright (c) 2024, aya and contributors
# For license information, please see license.txt

# import frappe


# صحيح



import frappe

def execute(filters=None):
    columns = get_columns()
    data = get_data()
    return columns, data

def get_columns():
    return [
        {"fieldname": "contract_name", "label": "Contract Name", "fieldtype": "Link", "options": "Contracts", "width": 200},
        {"fieldname": "contract_total_amount", "label": "Total Amount (Main Contract)", "fieldtype": "Currency", "width": 200},
        {"fieldname": "subcontracts_dropdown", "label": "Number of Subcontracts", "fieldtype": "HTML", "width": 300},  # عرض عدد العقود الفرعية
        {"fieldname": "total_subcontracts_amount", "label": "Total Amount (Subcontracts)", "fieldtype": "Currency", "width": 200},  # مجموع العقود الفرعية
        {"fieldname": "remaining_amount", "label": "Remaining Amount", "fieldtype": "Currency", "width": 200},
    ]

def get_data():
    data = []
    # جلب جميع العقود الرئيسية
    main_contracts = frappe.get_all("Contracts", fields=["name"])

    for contract in main_contracts:
        # حساب المجموع الكلي للعقد الرئيسي
        main_contract_amount = frappe.db.sql("""
            SELECT SUM(amount) 
            FROM `tabContracts Items` 
            WHERE parent = %s
        """, contract.name)[0][0] or 0

        # جلب العقود الفرعية المرتبطة بالعقد الرئيسي
        subcontracts = frappe.get_all("The Subcontracts", filters={"contracts": contract.name}, fields=["name"])

        # حساب المجموع الكلي للعقود الفرعية
        total_subcontracts_amount = 0
        subcontracts_dropdown = "<select style='width: 100%;' onchange='displaySubcontractDetails(this)'>"
        subcontracts_dropdown += f"<option disabled selected> {len(subcontracts)} Subcontracts </option>"  # عرض عدد العقود الفرعية

        for subcontract in subcontracts:
            subcontract_amount = frappe.db.sql("""
                SELECT SUM(amount)
                FROM `tabContracts Items`
                WHERE parent = %s
            """, subcontract.name)[0][0] or 0
            total_subcontracts_amount += subcontract_amount

            # إضافة خيار لكل عقد فرعي في القائمة المنسدلة
            subcontracts_dropdown += f"<option value='{subcontract.name}'>Subcontract: {subcontract.name} | Amount: {subcontract_amount}</option>"

        subcontracts_dropdown += "</select>"

        # حساب المبلغ المتبقي
        remaining_amount = main_contract_amount - total_subcontracts_amount

        # إضافة البيانات إلى التقرير
        data.append({
            "contract_name": contract.name,
            "contract_total_amount": main_contract_amount,
            "subcontracts_dropdown": subcontracts_dropdown,  # عرض عدد العقود الفرعية
            "total_subcontracts_amount": total_subcontracts_amount,  # مجموع العقود الفرعية
            "remaining_amount": remaining_amount,
        })

    return data
