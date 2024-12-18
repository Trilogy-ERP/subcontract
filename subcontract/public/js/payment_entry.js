frappe.ui.form.on('Payment Entry', {
    onload: function (frm) {
        if (frm.doc.custom_subcontract) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'The Subcontracts', 
                    name: frm.doc.custom_subcontract  
                },
                callback: function (response) {
                    let subcontract = response.message;  
                    if (subcontract) {
                        console.log("Contractor:", subcontract.contractor);
                        console.log("Contractor Type:", subcontract.contractor_type);

                        frm.set_value('payment_type', 'Pay'); 

                        frm.set_value('party_type', subcontract.contractor_type);  
                        frm.set_value('custom_total_amount', subcontract.remaining_total_amount); 

                        setTimeout(function() {
                            frm.set_value('party', subcontract.contractor); 
                             frm.refresh_field('custom_total_amount');

                            frm.refresh_field('party_type');
                            frm.refresh_field('party');
                        }, 50);  // تأخير 100 ميلي ثانية لضمان تحديث الحقول بشكل متسلسل
                    }
                }
            });
        }
    }
});
