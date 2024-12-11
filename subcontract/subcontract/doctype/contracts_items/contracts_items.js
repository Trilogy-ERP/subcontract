frappe.ui.form.on('ContractsItems', {
    rate: function (frm, cdt, cdn) {
        calculate_amount(cdt, cdn);
    },
    quantity: function (frm, cdt, cdn) {
        calculate_amount(cdt, cdn);
    }
});

function calculate_amount(cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.rate && row.quantity) {
        // حساب المبلغ لهذا الصف
        frappe.model.set_value(cdt, cdn, 'amount', row.rate * row.quantity);
    }
}
