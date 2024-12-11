from erpnext.accounts.doctype.payment_entry.payment_entry import PaymentEntry
import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.utils import fmt_money
from frappe import _
from frappe.model.document import Document

# class CustomPaymentEntry(PaymentEntry):
#     def on_submit(self):
#         frappe.msgprint("تم الوصول إلى الدالة on_submit في CustomPaymentEntry")
#         super().on_submit()
# from frappe.accounts.doctype.payment_entry.payment_entry import PaymentEntry
# import frappe

# class CustomPaymentEntry(PaymentEntry):
#  def on_submit(self):
#     super().on_submit()
#     subcontract_name = self.custom_subcontract

#     if subcontract_name:
#         subcontract_doc = frappe.get_doc("The Subcontracts", subcontract_name)

#         if not hasattr(self, 'custom_total_amount') or not hasattr(self, 'paid_amount'):
#             frappe.throw("Missing fields 'custom_total_amount' or 'paid_amount' in Payment Entry.")

#         paid_amount = float(self.paid_amount) if self.paid_amount else 0.0
#         custom_total_amount = float(self.custom_total_amount) if self.custom_total_amount else 0.0
#         remaining_amount = custom_total_amount - paid_amount
#         subcontract_doc.remaining_total_amount = remaining_amount
#         subcontract_doc.payment = "Paid"
#         subcontract_doc.save()




#  def validate(self):

#         paid_amount = self.paid_amount if self.paid_amount else 0.0
#         custom_total_amount = self.custom_total_amount if self.custom_total_amount else 0.0

#         if paid_amount > custom_total_amount:
#             formatted_paid_amount = fmt_money(paid_amount, currency=self.company_currency)
#             formatted_custom_total_amount = fmt_money(custom_total_amount, currency=self.company_currency)
            
#             frappe.throw(
#                 f"The paid amount ({formatted_paid_amount}) cannot be greater than the remaining amount ({formatted_custom_total_amount})."
#             )

#         super().validate()

# @frappe.whitelist()
# def make_payment_entry(source_name, target_doc=None):
#     def update_item(source, target, source_parent):
#         target.party_type = source.contractor_type
#         target.party = source.contractor
#         target.party_name = source.contractor
#         target.custom_total_amount = source.remaining_total_amount
#         target.payment_type = "Pay"

#     doc = get_mapped_doc(
#         "The Subcontracts", 
#         source_name, 
#         {
#             "The Subcontracts": { 
#                 "doctype": "Payment Entry", 
#                 "field_map": {
#                 },
#                 "postprocess": update_item, 
#             },
#         },
#         target_doc
#     )

#     return doc
class CustomPaymentEntry(PaymentEntry):
 def on_submit(self):
        super().on_submit()

        # الحصول على اسم السابكونتراكت
        subcontract_name = self.custom_subcontract

        if subcontract_name:
            # جلب مستند السابكونتراكت
            subcontract_doc = frappe.get_doc("The Subcontracts", subcontract_name)

            # التحقق من وجود الحقول المطلوبة
            if not hasattr(self, 'custom_total_amount') or not hasattr(self, 'paid_amount'):
                frappe.throw(_("Missing fields 'custom_total_amount' or 'paid_amount' in Payment Entry."))

            # الحصول على القيم المطلوبة
            custom_total_amount = float(self.custom_total_amount or 0.0)
            paid_amount = float(self.paid_amount or 0.0)

            # حساب المبلغ المتبقي
            remaining_amount = float(subcontract_doc.remaining_total_amount or custom_total_amount)
            updated_remaining_amount = remaining_amount - paid_amount

            # تحديث حقل remaining_total_amount
            subcontract_doc.remaining_total_amount = updated_remaining_amount

            # حفظ مستند السابكونتراكت بعد التعديل
            subcontract_doc.save()

            # إظهار رسالة نجاح

        frappe.msgprint(_("The remaining amount has been updated successfully. " + str(updated_remaining_amount)))

 def validate(self):
        paid_amount = self.paid_amount if self.paid_amount else 0.0
        custom_total_amount = self.custom_total_amount if self.custom_total_amount else 0.0
        
        # جلب القيمة المحدثة للـ remaining_total_amount من جدول The Subcontracts
        if self.custom_subcontract:
            subcontract_doc = frappe.get_doc("The Subcontracts", self.custom_subcontract)
            remaining_total_amount = subcontract_doc.remaining_total_amount if subcontract_doc.remaining_total_amount else subcontract_doc.net_total

            if paid_amount > remaining_total_amount:
                formatted_paid_amount = fmt_money(paid_amount, currency=self.company_currency)
                formatted_remaining_amount = fmt_money(remaining_total_amount, currency=self.company_currency)

                frappe.throw(
                    f"The paid amount ({formatted_paid_amount}) cannot be greater than the remaining amount ({formatted_remaining_amount})."
                )

        super().validate()
@frappe.whitelist()
def make_payment_entry(source_name, target_doc=None):
    def update_item(source, target, source_parent):
        target.party_type = source.contractor_type
        target.party = source.contractor
        target.party_name = source.contractor
        target.custom_total_amount = source.remaining_total_amount
        target.payment_type = "Pay"

    doc = get_mapped_doc(
        "The Subcontracts", 
        source_name, 
        {
            "The Subcontracts": { 
                "doctype": "Payment Entry", 
                "field_map": {
                },
                "postprocess": update_item, 
            },
        },
        target_doc
    )

    return doc

