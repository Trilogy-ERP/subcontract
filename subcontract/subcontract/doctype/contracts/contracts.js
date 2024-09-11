// frappe.ui.form.on('Contracts', {
//     refresh: function(frm) {
//         // تعيين تاريخ اليوم في حقل posting_date إذا لم يكن يحتوي على قيمة
//         if (!frm.doc.posting_date) {
//             frm.set_value('posting_date', frappe.datetime.get_today());
//         }

//         // حساب القيم لكل عنصر في contracts_items
//         calculate_amounts(frm);

//         // إضافة الزر إلى نموذج Contracts فقط إذا كانت حالة المستند "Submitted"
//         if (frm.doc.docstatus === 1) {
//             frm.add_custom_button(__('Create Subcontract'), function() {
//                 // استدعاء دالة Python لنقل المستند
//                 frappe.call({
//                     method: 'subcontract.subcontract.doctype.contracts.contracts.move_to_subcontracts',
//                     args: {
//                         contract_name: frm.doc.name  // تمرير اسم العقد بدلاً من المستند الكامل
//                     },
//                     callback: function(response) {
//                         if (response.message && response.message.name) {
//                             // frappe.msgprint(__('The Subcontract تم انشاء مستخلص للعقد '));
//                             // تنقلك مباشرةً إلى المستند الجديد في The Subcontracts
//                             frappe.set_route('Form', 'The Subcontracts', response.message.name);
//                         } else {
//                             frappe.msgprint(__('حدث خطأ أثناء انشاء المستخلص'));
//                         }
//                     }
//                 });
//             });
//         }
//     },

//     // عند إضافة عنصر جديد في الجدول الفرعي، يتم إعادة حساب القيم
//     contracts_items_add: function(frm, cdt, cdn) {
//         calculate_amounts(frm);
//     },

//     // عند عرض الجدول الفرعي، يتم إعادة حساب القيم
//     contracts_items_on_form_rendered: function(frm, cdt, cdn) {
//         calculate_amounts(frm);
//     },

//     //Clearance Type
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
//                     filters: { } 
//                 };
//             });
//         }
//     }
// });

// دالة لحساب القيم لكل عنصر في الجدول الفرعي
////////////////////////////////////////////////////////////////////////////////////////////////

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

        // حساب القيم لكل عنصر في contracts_items
        calculate_amounts(frm);


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
                            frappe.msgprint(__('The Subcontract has been created. Redirecting...'));
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
    contracts_items_add: function(frm, cdt, cdn) {
        calculate_amounts(frm);
    },

    // عند عرض الجدول الفرعي، يتم إعادة حساب القيم
    contracts_items_on_form_rendered: function(frm, cdt, cdn) {
        calculate_amounts(frm);
    },

        // إضافة التحكم في الحقول بناءً على Clearance Type
        clearance_type: function(frm) {
            if (frm.doc.clearance_type === 'Incoming') {
                frm.set_value('contractor_type', 'Supplier');
                frm.set_query('contractor', function() {
                    return {
                        filters: { }  // لا توجد فلترة، سيتم عرض كل الموردين
                    };
                });
            } else if (frm.doc.clearance_type === 'Outgoing') {
                frm.set_value('contractor_type', 'Customer');
                frm.set_query('contractor', function() {
                    return {
                        filters: { }  // لا توجد فلترة، سيتم عرض كل العملاء
                    };
                });
            }
        }
    
    
});

function calculate_amounts(frm) {
    // المرور على كل عنصر في contracts_items
    frm.doc.table_itfa.forEach(function(item) {
        if (item.rate && item.quantity) {
            item.amount = item.rate * item.quantity;  // حساب المبلغ
        } else {
            item.amount = 0;  // إذا كانت القيم مفقودة، تعيين المبلغ إلى 0
        }
    });

    // تحديث الحقول على الفورم
    frm.refresh_field('table_itfa');
}