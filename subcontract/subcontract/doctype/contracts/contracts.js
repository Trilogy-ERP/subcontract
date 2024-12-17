
// frappe.ui.form.on('Contracts', {
//     onload: function(frm) {
//         // جلب قيمة الشركة من الإعدادات
//         frappe.db.get_single_value('Construction Contract Setup', 'company')
//             .then(value => {
//                 if (value) {
//                     frm.set_value('company', value);
//                 }
//             });
//     },

//     refresh: function(frm) {
//         if (!frm.doc.posting_date) {
//             frm.set_value('posting_date', frappe.datetime.get_today());
//         }

//         if (frm.doc.docstatus === 1) {
//             let allCompleted = true;

//             frm.doc.table_itfa.forEach(function(item) {
//                 if (item.percentage_of_completion !== 100) {
//                     allCompleted = false;
//                 }
//             });

//             if (allCompleted) {
//                 frm.remove_custom_button(__('Create Subcontract'));
//             } else {
//                 frm.add_custom_button(__('Create Subcontract'), function() {
//                     frappe.call({
//                         method: 'subcontract.subcontract.doctype.contracts.contracts.move_to_subcontracts',
//                         args: {
//                             contract_name: frm.doc.name  // تمرير اسم العقد بدلاً من المستند الكامل
//                         },
//                         callback: function(response) {
//                             if (response.message) {
//                                 // إعادة توجيه المستخدم إلى المستند الجديد
//                                 frappe.set_route('Form', 'The Subcontracts', response.message);
//                             } else {
//                                 frappe.msgprint(__('An error occurred while creating the subcontract.'));
//                             }
//                         }
//                     });
//                 });
//             }
//         }

//         // حساب القيم الإجمالية عند تحديث النموذج
//         calculate_totals_and_grand(frm);
//     },

//     // مراقبة التغيرات في الحقول المتعلقة بالخصومات
//     percentage_of_tax_deduction_and_addition: function(frm) {
//         // إعادة حساب الإجماليات مباشرة بعد تعديل هذا الحقل
//         calculate_totals_and_grand(frm);
//     },
//     percentage_of_value_added_tax: function(frm) {
//         calculate_totals_and_grand(frm);
//     },
//     percentage_of_business_insurance: function(frm) {
//         calculate_totals_and_grand(frm);
//     },
//     percentage_of_current_organization: function(frm) {
//         calculate_totals_and_grand(frm);
//     },
//     other_deduction: function(frm) {
//         calculate_totals_and_grand(frm);
//     },

//     // إضافة التحكم في الحقول بناءً على Clearance Type
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
// });

// // حساب الإجمالي تلقائيًا عند تعديل الحقول داخل الجدول الفرعي
// frappe.ui.form.on('Contracts Items', {
//     rate: function(frm, cdt, cdn) {
//         update_row_amount_and_total(frm, cdt, cdn);
//         calculate_totals_and_grand(frm); // تحديث الإجماليات بعد تعديل السعر
//     },
//     quantity: function(frm, cdt, cdn) {
//         update_row_amount_and_total(frm, cdt, cdn);
//         calculate_totals_and_grand(frm); // تحديث الإجماليات بعد تعديل الكمية
//     }
// });

// // دالة لحساب القيم لكل صف في الجدول الفرعي
// function calculate_amounts(frm) {
//     let total_amount = 0;

//     // المرور على كل عنصر في table_itfa
//     frm.doc.table_itfa.forEach(function(item) {
//         if (item.rate && item.quantity) {
//             item.amount = item.rate * item.quantity;  // حساب المبلغ
//         } else {
//             item.amount = 0;  // إذا كانت القيم مفقودة، تعيين المبلغ إلى 0
//         }
//         total_amount += item.amount;  // جمع المبالغ
//     });

//     // تحديث الإجمالي في النموذج الرئيسي
//     frm.set_value('total_amount', total_amount);

//     // تحديث الجدول الفرعي
//     frm.refresh_field('table_itfa');
// }

// // دالة لحساب المبلغ الإجمالي عند تعديل صف معين
// function update_row_amount_and_total(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];

//     // حساب المبلغ للصف الحالي
//     if (row.rate && row.quantity) {
//         row.amount = row.rate * row.quantity;
//     } else {
//         row.amount = 0;
//     }

//     // تحديث الجدول الفرعي
//     frm.refresh_field('table_itfa');

//     // تحديث الإجمالي في النموذج الرئيسي
//     calculate_amounts(frm);
// }

// دالة لحساب الإجماليات والقيمة النهائية
// function calculate_totals_and_grand(frm) {
//     let total_amount = frm.doc.total_amount || 0;

//     // حساب القيم بناءً على النسب
//     let tax_deduction_amount = (frm.doc.percentage_of_tax_deduction_and_addition || 0) * total_amount / 100;
//     let vat_amount = (frm.doc.percentage_of_value_added_tax || 0) * total_amount / 100;
//     let insurance_amount = (frm.doc.percentage_of_business_insurance || 0) * total_amount / 100;
//     let organization_amount = (frm.doc.percentage_of_current_organization || 0) * total_amount / 100;
//     let other_deduction = (frm.doc.other_deduction || 0) * total_amount / 100;

//     // تعيين القيم المحسوبة إلى الحقول
//     frm.set_value('tax_deduction_amount', tax_deduction_amount);
//     frm.set_value('vat_amount', vat_amount);
//     frm.set_value('business_insurance_amount', insurance_amount);
//     frm.set_value('current_organization_amount', organization_amount);

//     // حساب إجمالي الخصومات
//     let deductions_amount =  other_deduction;
//     frm.set_value('deductions_amount', deductions_amount);

//     // حساب الإجمالي النهائي عبر الإضافة (grand_total_amount)
//     let grand_total_amount = total_amount + vat_amount + insurance_amount + organization_amount + deductions_amount;
//     frm.set_value('grand_total_amount', grand_total_amount);

//     // تحديث الحقول في النموذج
//     frm.refresh_fields();
// }








// frappe.ui.form.on('Contracts', {
//     onload: function(frm) {
//         // جلب قيمة الشركة من الإعدادات
//         frappe.db.get_single_value('Construction Contract Setup', 'company')
//             .then(value => {
//                 if (value) {
//                     frm.set_value('company', value);
//                 }
//             });
//     },

//     refresh: function(frm) {
//         if (!frm.doc.posting_date) {
//             frm.set_value('posting_date', frappe.datetime.get_today());
//         }

//         // إضافة الزر إلى نموذج Contracts فقط إذا كانت حالة المستند "Submitted"
//         if (frm.doc.docstatus === 1) {

//             let allCompleted = true;

//               frm.doc.table_itfa.forEach(function(item) {
//             if (item.percentage_of_completion !== 100) {
//               allCompleted = false;
//               frm.add_custom_button(__('Create Subcontract'), function() {
//                 // استدعاء دالة Python لنقل المستند
//                 frappe.call({
//                     method: 'subcontract.subcontract.doctype.contracts.contracts.move_to_subcontracts',
//                     args: {
//                         contract_name: frm.doc.name  // تمرير اسم العقد بدلاً من المستند الكامل
//                     },
//                     callback: function(response) {
//                         if (response.message) {
//                             // إعادة توجيه المستخدم إلى المستند الجديد
//                             frappe.set_route('Form', 'The Subcontracts', response.message);
//                         } else {
//                             frappe.msgprint(__('An error occurred while creating the subcontract.'));
//                         }
//                     }
//                 });
//             });
//         }
//     }}},

frappe.ui.form.on('Contracts', {
        // Trigger calculations when relevant fields change
        custom_recovery_advance_5: function(frm) {
            calculate_recovery_advance(frm);
        },
        total_amount: function(frm) {
            calculate_recovery_advance(frm);
        },
        custom_vat_15: function(frm) {
            calculate_total_vat1(frm);
        },
        custom_amount_after_ap: function(frm) {
            calculate_total_vat1(frm);
            calculate_total_including_vat(frm);
        },
        custom_total_vat1: function(frm) {
            calculate_total_including_vat(frm);
        },
        custom_retention_10: function(frm) {
            calculate_retention(frm);
        },
        custom_total_including_vat: function(frm) {
            calculate_retention(frm);
            calculate_net_current_payment(frm);
        },
        custom_retention: function(frm) {
            calculate_total_deduction(frm);
        },
        custom_debit_note_1: function(frm) {
            calculate_total_deduction(frm);
        },
        custom_debit_note_2: function(frm) {
            calculate_total_deduction(frm);
        },
        custom_debit_note_3: function(frm) {
            calculate_total_deduction(frm);
        },
        custom_total_deduction: function(frm) {
            calculate_net_current_payment(frm);
        },
    onload: function (frm) {
        // جلب قيمة الشركة من الإعدادات
        frappe.db.get_single_value('Construction Contract Setup', 'company')
            .then(value => {
                if (value) {
                    frm.set_value('company', value);
                }
            });
        // Ensure all calculated fields are read-only when the form loads
        set_fields_read_only(frm);
    },

    refresh: function (frm) {
        if (!frm.doc.posting_date) {
            frm.set_value('posting_date', frappe.datetime.get_today());
        }

        // إضافة الزر إلى نموذج Contracts فقط إذا كانت حالة المستند "Submitted"
        if (frm.doc.docstatus === 1) {
            let allCompleted = true;

            frm.doc.table_itfa.forEach(function (item) {
                if (item.percentage_of_completion !== 100) {
                    allCompleted = false;
                }
            });

            if (!allCompleted) {
                frm.add_custom_button(__('Create Subcontract'), function () {
                    // استدعاء دالة Python لنقل المستند
                    frappe.call({
                        method: 'subcontract.subcontract.doctype.contracts.contracts.move_to_subcontracts',
                        args: {
                            contract_name: frm.doc.name // تمرير اسم العقد بدلاً من المستند الكامل
                        },
                        callback: function (response) {
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
        }
    },

    // إعادة حساب الإجمالي عند إضافة صف جديد
    contracts_items_add: function (frm) {
        calculate_amounts(frm);
    },

    // إعادة حساب الإجمالي عند عرض الجدول الفرعي
    contracts_items_on_form_rendered: function (frm) {
        calculate_amounts(frm);
    },

    clearance_type: function (frm) {
        if (frm.doc.clearance_type === 'Incoming') {
            frm.set_value('contractor_type', 'Supplier');
            frm.set_query('contractor', function () {
                return {
                    filters: {}
                };
            });
        } else if (frm.doc.clearance_type === 'Outgoing') {
            frm.set_value('contractor_type', 'Customer');
            frm.set_query('contractor', function () {
                return {
                    filters: {} // فلترة العملاء فقط
                };
            });
        }
    }
});

// Function to calculate recovery advance and amount after advance payment
function calculate_recovery_advance(frm) {
    let total_amount = frm.doc.total_amount || 0;
    let recovery_percent = frm.doc.custom_recovery_advance_5 || 0;

    let recovery_advance = (total_amount * recovery_percent) / 100;
    frm.set_value('custom_total_recover_advance', recovery_advance);

    let amount_after_ap = total_amount - recovery_advance;
    frm.set_value('custom_amount_after_ap', amount_after_ap);

    set_fields_read_only(frm);
}

// Function to calculate total VAT
function calculate_total_vat1(frm) {
    let vat_percentage = frm.doc.custom_vat_15 || 0;
    let amount_after_ap = frm.doc.custom_amount_after_ap || 0;

    let total_vat1 = (amount_after_ap * vat_percentage) / 100;
    frm.set_value('custom_total_vat1', total_vat1);

    set_fields_read_only(frm);
}

// Function to calculate total including VAT
function calculate_total_including_vat(frm) {
    let amount_after_ap = frm.doc.custom_amount_after_ap || 0;
    let total_vat1 = frm.doc.custom_total_vat1 || 0;

    let total_including_vat = amount_after_ap + total_vat1;
    frm.set_value('custom_total_including_vat', total_including_vat);

    set_fields_read_only(frm);
}

// Function to calculate retention
function calculate_retention(frm) {
    let total_including_vat = frm.doc.custom_total_including_vat || 0;
    let retention_percent = frm.doc.custom_retention_10 || 0;

    let retention_amount = (total_including_vat * retention_percent) / 100;
    frm.set_value('custom_retention', retention_amount);

    set_fields_read_only(frm);
}

// Function to calculate total deduction
function calculate_total_deduction(frm) {
    let retention = frm.doc.custom_retention || 0;
    let debit_note_1 = frm.doc.custom_debit_note_1 || 0;
    let debit_note_2 = frm.doc.custom_debit_note_2 || 0;
    let debit_note_3 = frm.doc.custom_debit_note_3 || 0;

    let total_deduction = retention + debit_note_1 + debit_note_2 + debit_note_3;
    frm.set_value('custom_total_deduction', total_deduction);

    set_fields_read_only(frm);
}

// Function to calculate net current payment
function calculate_net_current_payment(frm) {
    let total_including_vat = frm.doc.custom_total_including_vat || 0;
    let total_deduction = frm.doc.custom_total_deduction || 0;

    let net_current_payment = total_including_vat - total_deduction;
    frm.set_value('custom_net_current_payment', net_current_payment);

    set_fields_read_only(frm);
}

// Function to set fields as read-only
function set_fields_read_only(frm) {
    frm.set_df_property('custom_total_recover_advance', 'read_only', 1);
    frm.set_df_property('custom_amount_after_ap', 'read_only', 1);
    frm.set_df_property('custom_total_vat1', 'read_only', 1);
    frm.set_df_property('custom_total_including_vat', 'read_only', 1);
    frm.set_df_property('custom_retention', 'read_only', 1);
    frm.set_df_property('custom_total_deduction', 'read_only', 1);
    frm.set_df_property('custom_net_current_payment', 'read_only', 1);
}

// حساب الإجمالي تلقائيًا عند تعديل الحقول داخل الجدول الفرعي
frappe.ui.form.on('Contracts Items', {
    rate: function (frm, cdt, cdn) {
        update_row_amount_and_total(frm, cdt, cdn);
    },
    quantity: function (frm, cdt, cdn) {
        update_row_amount_and_total(frm, cdt, cdn);
    }
});

// دالة لحساب القيم لكل صف في الجدول الفرعي
function calculate_amounts(frm) {
    let total_amount = 0;

    // المرور على كل عنصر في table_itfa
    frm.doc.table_itfa.forEach(function (item) {
        if (item.rate && item.quantity) {
            item.amount = item.rate * item.quantity; // حساب المبلغ
        } else {
            item.amount = 0; // إذا كانت القيم مفقودة، تعيين المبلغ إلى 0
        }
        total_amount += item.amount; // جمع المبالغ
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
