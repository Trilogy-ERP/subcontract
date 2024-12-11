frappe.ui.form.on('Payment Entry', {
    on_submit: function(frm) {
        console.log("on_submit triggered");  // تحقق من أن الكود يتم تنفيذه

        const subcontract_name = frm.doc.custom_subcontract;
        if (subcontract_name) {
            console.log("Subcontract found: ", subcontract_name);  // تحقق من قيمة subcontract_name

            // جلب مستند السابكونتراكت
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'The Subcontracts',
                    name: subcontract_name
                },
                callback: function(response) {
                    console.log("Subcontract doc: ", response.message);  // تحقق من استجابة API

                    const subcontract_doc = response.message;
                    const custom_total_amount = frm.doc.custom_total_amount || 0;
                    const paid_amount = frm.doc.paid_amount || 0;

                    // حساب المبلغ المتبقي
                    const remaining_amount = subcontract_doc.remaining_total_amount || custom_total_amount;
                    const updated_remaining_amount = remaining_amount - paid_amount;

                    // تحديث حقل remaining_total_amount في مستند السابكونتراكت
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'The Subcontracts',
                            name: subcontract_name,
                            fieldname: 'remaining_total_amount',
                            value: updated_remaining_amount
                        },
                        callback: function() {
                            console.log("Remaining amount updated successfully");
                        }
                    });
                }
            });
        }
    }
});
