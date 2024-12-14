frappe.ui.form.on('Contracts', {

    onload: function(frm) {
        // جلب قيمة الشركة من الإعدادات
        frappe.db.get_single_value('Construction Contract Setup', 'company')
            .then(value => {
                if (value) {
                    frm.set_value('company', value);
                }
            });
    },

    refresh: function(frm) {
        if (!frm.doc.posting_date) {
            frm.set_value('posting_date', frappe.datetime.get_today());
        }

        // إضافة الزر إلى نموذج Contracts فقط إذا كانت حالة المستند "Submitted"
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__('Create Subcontract'), function() {
                // استدعاء دالة Python لنقل المستند
                frappe.call({
                    method: 'subcontract.subcontract.doctype.contracts.contracts.move_to_subcontracts',
                    args: {
                        contract_name: frm.doc.name  // تمرير اسم العقد بدلاً من المستند الكامل
                    },
                    callback: function(response) {
                        if (response.message) {
                            // إعادة توجيه المستخدم إلى المستند الجديد
                            frappe.set_route('Form', 'The Subcontracts', response.message);
                        } else {
                            frappe.msgprint(__('An error occurred while creating the subcontract.'));
                        }
                    }
                });
            });
        }
    },

    // إعادة حساب الإجمالي عند إضافة صف جديد
    contracts_items_add: function(frm) {
        calculate_amounts(frm);
    },

    // إعادة حساب الإجمالي عند عرض الجدول الفرعي
    contracts_items_on_form_rendered: function(frm) {
        calculate_amounts(frm);
    },
});

// حساب الإجمالي تلقائيًا عند تعديل الحقول داخل الجدول الفرعي
frappe.ui.form.on('Contracts Items', {
    rate: function(frm, cdt, cdn) {
        update_row_amount_and_total(frm, cdt, cdn);
    },
    quantity: function(frm, cdt, cdn) {
        update_row_amount_and_total(frm, cdt, cdn);
    }
});

// دالة لحساب القيم لكل صف في الجدول الفرعي
function calculate_amounts(frm) {
    let total_amount = 0;

    // المرور على كل عنصر في table_itfa
    frm.doc.table_itfa.forEach(function(item) {
        if (item.rate && item.quantity) {
            item.amount = item.rate * item.quantity;  // حساب المبلغ
        } else {
            item.amount = 0;  // إذا كانت القيم مفقودة، تعيين المبلغ إلى 0
        }
        total_amount += item.amount;  // جمع المبالغ
    });

    // تحديث الإجمالي في النموذج الرئيسي
    frm.set_value('total_amount', total_amount);

    // تحديث الجدول الفرعي
    frm.refresh_field('table_itfa');
}

// دالة لحساب المبلغ الإجمالي عند تعديل صف معين
function update_row_amount_and_total(frm, cdt, cdn) {
    const row = locals[cdt][cdn];

    // حساب المبلغ للصف الحالي
    if (row.rate && row.quantity) {
        row.amount = row.rate * row.quantity;
    } else {
        row.amount = 0;
    }

    // تحديث الجدول الفرعي
    frm.refresh_field('table_itfa');

    // تحديث الإجمالي في النموذج الرئيسي
    calculate_amounts(frm);
}

// إضافة التحكم في الحقول بناءً على Clearance Type
// frappe.ui.form.on('Contracts', {
//     clearance_type: function(frm) {
//         if (frm.doc.clearance_type === 'Incoming') {
//             frm.set_value('contractor_type', 'Supplier');
//             frm.set_query('contractor', function() {
//                 return {
//                     filters: { }
//                 };
//             });
//         } else if (frm.doc.clearance_type === 'Outgoing') {
//             frm.set_value('contractor_type', 'Customer');
//             frm.set_query('contractor', function() {
//                 return {
//                     filters: { }  // فلترة العملاء فقط
//                 };
//             });
//         }
//     }