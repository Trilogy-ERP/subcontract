import frappe
from frappe.model.document import Document

class Contracts(Document):
    pass

# @frappe.whitelist()
# def move_to_subcontracts(contract_name):
#     # التحقق من وجود العقد قبل استرجاعه
#     if not frappe.db.exists('Contracts', contract_name):
#         frappe.throw(f"Contract with name {contract_name} does not exist.")

#     # استرجاع المستند من جدول Contracts
#     contract_doc = frappe.get_doc('Contracts', contract_name)

#     # إنشاء مستند جديد في جدول TheSubcontracts
#     subcontract_doc = frappe.new_doc('The Subcontracts')

#     # نقل البيانات من Contracts إلى TheSubcontracts
#     subcontract_doc.contracts = contract_doc.naming_series
#     subcontract_doc.contractor_type = contract_doc.contractor_type or "Default Contractor Type"
#     subcontract_doc.contractor = contract_doc.contractor
#     subcontract_doc.project = contract_doc.project
#     subcontract_doc.cost_center = contract_doc.cost_center
#     subcontract_doc.posting_date = contract_doc.posting_date

#     # التعامل مع حقل الـ child table "contract-item"
#     for child_row in contract_doc.table_itfa:
#         subcontract_child_row = subcontract_doc.append('items', {})

#         # نسخ البيانات من child row في Contracts إلى The Subcontracts
#         subcontract_child_row.business_item = child_row.business_item
#         subcontract_child_row.item_description = child_row.item_description
#         subcontract_child_row.quantity = child_row.quantity
#         subcontract_child_row.uom = child_row.uom
#         subcontract_child_row.amount = child_row.amount
#         subcontract_child_row.rate = child_row.rate
#         subcontract_child_row.item_name = child_row.item_name or "Default Item Name"

#     # حفظ المستند الجديد في The Subcontracts
#     subcontract_doc.insert()

#     # إرجاع اسم المستند الجديد
#     return {'name': subcontract_doc.name}



# @frappe.whitelist()
# def move_to_subcontracts(contract_name):
#     # التحقق من وجود العقد قبل استرجاعه
#     if not frappe.db.exists('Contracts', contract_name):
#         frappe.throw(f"Contract with name {contract_name} does not exist.")

#     # استرجاع المستند من جدول Contracts
#     contract_doc = frappe.get_doc('Contracts', contract_name)

#     # إنشاء مستند جديد في جدول The Subcontracts
#     subcontract_doc = frappe.new_doc('The Subcontracts')

#     # نقل البيانات من Contracts إلى The Subcontracts
#     subcontract_doc.contracts = contract_doc.name
#     subcontract_doc.contractor_type = contract_doc.contractor_type or "Default Contractor Type"
#     subcontract_doc.contractor = contract_doc.contractor
#     subcontract_doc.project = contract_doc.project
#     subcontract_doc.cost_center = contract_doc.cost_center
#     subcontract_doc.posting_date = contract_doc.posting_date
#     subcontract_doc.company = contract_doc.company

#     # التعامل مع حقل الـ child table "contract-item"
#     for child_row in contract_doc.table_itfa:
#         subcontract_child_row = subcontract_doc.append('items', {})
#         # نسخ البيانات من child row في Contracts إلى The Subcontracts
#         subcontract_child_row.business_item = child_row.business_item
#         subcontract_child_row.item_description = child_row.item_description
#         subcontract_child_row.quantity = child_row.quantity
#         subcontract_child_row.uom = child_row.uom
#         subcontract_child_row.amount = child_row.amount
#         subcontract_child_row.rate = child_row.rate
#         subcontract_child_row.item_name = child_row.item_name or "Default Item Name"

    
    
#     # حفظ المستند الجديد في The Subcontracts
#     subcontract_doc.insert()

#     # إرجاع اسم المستند الجديد
#     return subcontract_doc.name


@frappe.whitelist()
def move_to_subcontracts(contract_name):
    if not frappe.db.exists('Contracts', contract_name):
        frappe.throw(f"Contract with name {contract_name} does not exist.")

    contract_doc = frappe.get_doc('Contracts', contract_name)

    subcontract_doc = frappe.new_doc('The Subcontracts')

    subcontract_doc.contracts = contract_doc.name
    subcontract_doc.contractor_type = contract_doc.contractor_type or "Default Contractor Type"
    subcontract_doc.contractor = contract_doc.contractor
    subcontract_doc.project = contract_doc.project
    subcontract_doc.cost_center = contract_doc.cost_center
    subcontract_doc.posting_date = contract_doc.posting_date
    subcontract_doc.company = contract_doc.company

    for child_row in contract_doc.table_itfa:
        if child_row.percentage_of_completion != 100:
            subcontract_child_row = subcontract_doc.append('items', {})
            subcontract_child_row.business_item = child_row.business_item
            subcontract_child_row.item_description = child_row.item_description
            subcontract_child_row.remaining_quantity = child_row.remaining_quantity
            subcontract_child_row.quantity = child_row.quantity
            subcontract_child_row.amount = 0
            subcontract_child_row.uom = child_row.uom
            subcontract_child_row.remaining_amount = child_row.remaining_amount
            subcontract_child_row.rate = child_row.rate
            subcontract_child_row.item_name = child_row.item_name or "Default Item Name"
    
    subcontract_doc.insert()

    return subcontract_doc.name




