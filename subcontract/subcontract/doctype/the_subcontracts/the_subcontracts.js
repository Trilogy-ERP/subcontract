// frappe.ui.form.on('The Subcontracts', {
//     refresh: function(frm) {
//         // تعيين الفلترة بناءً على Contractor Type
//         frm.set_query('contractor', function() {
//             if (frm.doc.contractor_type === 'Supplier') {
//                 return {
//                     filters: {
//                         doctype: 'Supplier' 
//                     }
//                 };
//             } else if (frm.doc.contractor_type === 'Customer') {
//                 return {
//                     filters: {
//                         doctype: 'Customer'     
//                     }
//                 };
//             }
//         });
//     },

//     items_add: function(frm, cdt, cdn) {
//         update_percentage_of_completion(frm);
//         calculate_net_total(frm);
//     },

//     items_on_form_rendered: function(frm, cdt, cdn) {
//         update_percentage_of_completion(frm);
//         calculate_net_total(frm);
//     },

//     quantity: function(frm, cdt, cdn) {
//         update_percentage_of_completion(frm);
//         calculate_net_total(frm);
//     },
    
//     complete_rate: function(frm, cdt, cdn) {
//         update_percentage_of_completion(frm);
//         calculate_net_total(frm);
//     },

//     contractor_type: function(frm) {
//         // تغيير الفلترة عندما تتغير قيمة Contractor Type
//         frm.set_query('contractor', function() {
//             if (frm.doc.contractor_type === 'Supplier') {
//                 return {
//                     filters: {
//                         doctype: 'Supplier'  // جلب فقط الموردين
//                     }
//                 };
//             } else if (frm.doc.contractor_type === 'Customer') {
//                 return {
//                     filters: {
//                         doctype: 'Customer'  // جلب فقط العملاء
//                     }
//                 };
//             }
//         });
//     },

//     before_save: function(frm) {
//         update_percentage_of_completion(frm);
//         calculate_net_total(frm);
//     }
// });

// // دالة لحساب نسبة الاكتمال
// function update_percentage_of_completion(frm) {
//     frm.doc.items.forEach(function(item) {
//         if (item.quantity && item.complete_rate) {
//             item.percentage_of_completion = (item.complete_rate / item.quantity) * 100;  
//         } else {
//             item.percentage_of_completion = 0; 
//         }
//     });

//     frm.refresh_field('items');
// }

// // دالة لحساب مجموع قيم amount وتعيينها إلى حقل net_total
// function calculate_net_total(frm) {
//     let total = 0;

//     // المرور على كل عنصر في جدول items وجمع قيم amount
//     frm.doc.items.forEach(function(item) {
//         total += item.amount || 0;
//     });

//     // تعيين مجموع المبالغ إلى حقل net_total
//     frm.set_value('net_total', total);

//     // تحديث الحقول على الفورم
//     frm.refresh_field('net_total');
// }

frappe.ui.form.on('The Subcontracts', {
    refresh: function(frm) {
        // تعيين الفلترة بناءً على Contractor Type
        frm.set_query('contractor', function() {
            if (frm.doc.contractor_type === 'Supplier') {
                return {
                    filters: {
                        doctype: 'Supplier' 
                    }
                };
            } else if (frm.doc.contractor_type === 'Customer') {
                return {
                    filters: {
                        doctype: 'Customer'     
                    }
                };
            }
        });
    },

    items_add: function(frm, cdt, cdn) {
        update_percentage_of_completion(frm);
        calculate_net_total(frm);
    },

    items_on_form_rendered: function(frm, cdt, cdn) {
        update_percentage_of_completion(frm);
        calculate_net_total(frm);
    },

    quantity: function(frm, cdt, cdn) {
        update_percentage_of_completion(frm);
        calculate_net_total(frm);
    },
    
    complete_rate: function(frm, cdt, cdn) {
        update_percentage_of_completion(frm);
        calculate_net_total(frm);
    },

    contractor_type: function(frm) {
        // تغيير الفلترة عندما تتغير قيمة Contractor Type
        frm.set_query('contractor', function() {
            if (frm.doc.contractor_type === 'Supplier') {
                return {
                    filters: {
                        doctype: 'Supplier'
                    }
                };
            } else if (frm.doc.contractor_type === 'Customer') {
                return {
                    filters: {
                        doctype: 'Customer'
                    }
                };
            }
        });
    },

    before_save: function(frm) {
        update_percentage_of_completion(frm);
        calculate_net_total(frm);
        check_completion_percentage(frm);
    },

    onload: function(frm) {
        // حساب net_total عند تحميل المستند لأول مرة
        calculate_net_total(frm);
    }
});

// دالة لحساب نسبة الاكتمال
function update_percentage_of_completion(frm) {
    frm.doc.items.forEach(function(item) {
        if (item.quantity && item.complete_rate) {
            item.percentage_of_completion = (item.complete_rate / item.quantity) * 100;
        } else {
            item.percentage_of_completion = 0;
        }
    });

    frm.refresh_field('items');
}

// دالة لحساب مجموع قيم amount وتعيينها إلى حقل net_total
function calculate_net_total(frm) {
    let total = 0;

    // المرور على كل عنصر في جدول items وجمع قيم amount
    frm.doc.items.forEach(function(item) {
        total += item.amount || 0;
    });

    // تعيين مجموع المبالغ إلى حقل net_total
    frm.set_value('net_total', total);

    // تحديث الحقول على الفورم
    frm.refresh_field('net_total');
}

// دالة للتحقق من أن نسبة الاكتمال ليست 100% لكل العناصر
function check_completion_percentage(frm) {
    let all_completed = frm.doc.items.every(function(item) {
        return item.percentage_of_completion === 100;
    });

    if (all_completed) {
        frappe.throw(__('Cannot create a subcontract, all items are 100% completed.'));
    }
}
