frappe.ui.form.on('The Subcontracts', {
    refresh: function(frm) {
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
        if (frm.doc.docstatus == 1) { 
            frm.add_custom_button(__('Payment Entry'), function () {
                frappe.call({
                    method: "subcontract.overrides.payment_entry.make_payment_entry",
                    args: {
                        source_name: frm.doc.name  
                    },
                    callback: function (r) {
                        if (r.message) {
                            frappe.model.sync(r.message);
                            frappe.set_route('Form', r.message.doctype, r.message.name);
                        }
                    }
                });
            }, __('Create'));
        }
       
        // function check_dashboard(attempts) {
        //     console.log("Checking Dashboard:", frm.dashboard);
        
        //     if (frm.dashboard && frm.dashboard.non_standard_fieldnames) {
        //         console.log("Dashboard loaded successfully.");
        //         let payment_entry = frm.dashboard.non_standard_fieldnames["Payment Entry"];
        //         if (payment_entry) {
        //             frm.add_custom_button(__('Payment Entry'), function () {
        //                 frappe.call({
        //                     method: "subcontract.overrides.payment_entry.make_payment_entry",
        //                     args: {
        //                         source_name: frm.doc.name
        //                     },
        //                     callback: function (r) {
        //                         if (r.message) {
        //                             frappe.set_route("Form", "Payment Entry", r.message.name);
        //                         } else {
        //                             console.error("Error: No message received in callback.");
        //                         }
        //                     }
        //                 });
        //             }, __("Create"));
        //         }
        //     } else if (attempts > 0) {
        //         console.warn(`Retrying: Dashboard is not loaded yet. Attempts left: ${attempts}`);
        //         setTimeout(() => check_dashboard(attempts - 1), 1000);
        //     } else {
        //         console.error("Dashboard failed to load after multiple attempts.");
        //         alert("There was an issue loading the Dashboard. Please try again later.");
        //     }
        // }
        
        // check_dashboard(10);
        
        
    
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

    // before_save: function(frm) {
    //     update_percentage_of_completion(frm);
    //     calculate_net_total(frm);
    //     check_completion_percentage(frm);
    // },

        before_save: function(frm) {
            update_percentage_of_completion(frm);
            calculate_net_total(frm);
            check_completion_percentage(frm);
                frm.doc.items.forEach(item => {
                let quantity = parseFloat(item.quantity) || 0;
                let rate = item.rate || 0; 
    
                let amount = quantity * rate;
    
                item.amount = amount;
            });
        }
    ,
    on_save: function(frm) {
        try {
            if (frm.doc.net_total !== undefined) {
                frm.set_value('remaining_total_amount', frm.doc.net_total);
            }
        } catch (error) {
            console.error('Error while updating remaining_total_amount:', error);
        }
    },


    onload: function(frm) {
        calculate_net_total(frm);
    }
});

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

function calculate_net_total(frm) {
    let total = 0;

    frm.doc.items.forEach(function(item) {
        total += item.amount || 0;
    });

    frm.set_value('net_total', total);

    frm.refresh_field('net_total');
}

function check_completion_percentage(frm) {
    let all_completed = frm.doc.items.every(function(item) {
        return item.percentage_of_completion === 100;
    });

    if (all_completed) {
        frappe.throw(__('Cannot create a subcontract, all items are 100% completed.'));
    }
}




// fatma 

// frappe.ui.form.on('The Subcontracts', {
//     validate: async function (frm) {
//         try {
//             const contract_name = frm.doc.contracts;

//             if (!contract_name) {
//                 return;
//             }

//             await validate_subcontract_items(contract_name, frm);
//         } catch (error) {
//             frappe.msgprint(error.message);
//             frappe.validated = false; 
//         }
//     },

//     on_submit: async function (frm) {
//         try {
//             const contract_name = frm.doc.contracts;

//             if (!contract_name) {
//                 return;
//             }

//             await update_contract_values(contract_name);
//         } catch (error) {
//             console.error(error);
//         }
//     },
//     // after_save: function(frm) {
//     //     if (frm.doc.net_total !== undefined && frm.doc.remaining_total_amount === frm.doc.net_total) {
//     //         frm.set_value('remaining_total_amount', frm.doc.net_total);
//     //         frm.save(); // حفظ المستند تلقائيًا بعد التحديث
//     //     }
//     // } 
//      after_save: function(frm) {
//             if (frm.doc.remaining_total_amount === 0 && frm.doc.net_total !== undefined && !frm.doc.__remaining_updated) {
//                 frm.set_value('remaining_total_amount', frm.doc.net_total);
//                 frm.doc.__remaining_updated = true; 
//                 frm.save(); 
//             }
//         }
    
// });

// async function validate_subcontract_items(contract_name, frm) {
//     try {
//         const contract_doc = await frappe.db.get_doc('Contracts', contract_name);

//         if (!contract_doc || !contract_doc.table_itfa) {
//             return;
//         }

//         const completed_quantities = {};
//         const completed_amounts = {};

//         if (!frm.doc.items) {
//             return;
//         }

//         for (const item of frm.doc.items) {
//             const item_name = item.item_name;

//             if (!completed_quantities[item_name]) {
//                 completed_quantities[item_name] = 0;
//             }
//             completed_quantities[item_name] += parseFloat(item.quantity) || 0;

//             if (!completed_amounts[item_name]) {
//                 completed_amounts[item_name] = 0;
//             }
//             completed_amounts[item_name] += parseFloat(item.amount) || 0;

//             const contract_row = contract_doc.table_itfa.find(row => row.item_name === item_name);
//             if (contract_row) {
//                 const remaining_quantity = Math.max(contract_row.quantity - (completed_quantities[item_name] || 0), 0);
//                 const remaining_amount = Math.max(contract_row.amount - (completed_amounts[item_name] || 0), 0);

//                 if (item.quantity > remaining_quantity) {
//                     throw new Error(`الكمية المدخلة (${item.quantity}) أكبر من الكمية المتبقية (${remaining_quantity}) للعقد الرئيسي.`);
//                 }

//                 if (item.amount > remaining_amount) {
//                     throw new Error(`المبلغ المدخل (${item.amount}) أكبر من المبلغ المتبقي (${remaining_amount}) للعقد الرئيسي.`);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// async function update_contract_values(contract_name) {
//     try {
//         const contract_doc = await frappe.db.get_doc('Contracts', contract_name);

//         if (!contract_doc || !contract_doc.table_itfa) {
//             return;
//         }

//         const subcontracts = await frappe.call({
//             method: 'frappe.client.get_list',
//             args: {
//                 doctype: 'The Subcontracts',
//                 filters: { contracts: contract_name },
//                 fields: ['name']
//             }
//         });

//         if (!subcontracts.message.length) {
//             return;
//         }

//         const completed_quantities = {};
//         const completed_amounts = {};

//         for (const subcontract of subcontracts.message) {
//             const subcontract_doc = await frappe.db.get_doc('The Subcontracts', subcontract.name);

//             if (!subcontract_doc.items) continue;

//             for (const item of subcontract_doc.items) {
//                 const item_name = item.item_name;

//                 if (!completed_quantities[item_name]) {
//                     completed_quantities[item_name] = 0;
//                 }
//                 completed_quantities[item_name] += parseFloat(item.quantity) || 0;

//                 if (!completed_amounts[item_name]) {
//                     completed_amounts[item_name] = 0;
//                 }
//                 completed_amounts[item_name] += parseFloat(item.amount) || 0;
//             }
//         }

//         for (const row of contract_doc.table_itfa) {
//             const item_name = row.item_name;

//             // تحديث نسبة الإنجاز
//             if (contract_doc.docstatus === 1) {
//                 const total_completed_quantity = completed_quantities[item_name] || 0;
//                 row.percentage_of_completion = row.quantity > 0
//                     ? ((total_completed_quantity / row.quantity) * 100).toFixed(2)
//                     : 0;
//             }
//             // تحديث الكمية المتبقية
//             row.remaining_quantity = Math.max(row.quantity - total_completed_quantity, 0);

//             // تحديث المبلغ المتبقي
//             const total_completed_amount = completed_amounts[item_name] || 0;
//             row.remaining_amount = Math.max(row.amount - total_completed_amount, 0);
//         }

//         await frappe.call({
//             method: 'frappe.client.save',
//             args: { doc: contract_doc }
//         });
//     } catch (error) {
//         console.error(error);
//         frappe.msgprint(`حدث خطأ أثناء تحديث العقد الرئيسي: ${error.message}`);
//     }
// }
frappe.ui.form.on('The Subcontracts', {
    validate: async function (frm) {
        try {
            const contract_name = frm.doc.contracts;

            if (!contract_name) {
                return;
            }

            await validate_subcontract_items(contract_name, frm);
        } catch (error) {
            frappe.msgprint(error.message);
            frappe.validated = false; 
        }
    },

    on_submit: async function (frm) {
        try {
            const contract_name = frm.doc.contracts;

            if (!contract_name) {
                return;
            }

            await update_contract_values(contract_name);
        } catch (error) {
            console.error(error);
        }
    },

    after_save: function(frm) {
        if (frm.doc.remaining_total_amount === 0 && frm.doc.net_total !== undefined && !frm.doc.__remaining_updated) {
            frm.set_value('remaining_total_amount', frm.doc.net_total);
            frm.doc.__remaining_updated = true; 
            frm.save(); 
        }
    }
});

async function validate_subcontract_items(contract_name, frm) {
    try {
        const contract_doc = await frappe.db.get_doc('Contracts', contract_name);

        if (!contract_doc || !contract_doc.table_itfa) {
            return;
        }

        const completed_quantities = {};
        const completed_amounts = {};

        if (!frm.doc.items) {
            return;
        }

        for (const item of frm.doc.items) {
            const item_name = item.item_name;

            if (!completed_quantities[item_name]) {
                completed_quantities[item_name] = 0;
            }
            completed_quantities[item_name] += parseFloat(item.quantity) || 0;

            if (!completed_amounts[item_name]) {
                completed_amounts[item_name] = 0;
            }
            completed_amounts[item_name] += parseFloat(item.amount) || 0;

            const contract_row = contract_doc.table_itfa.find(row => row.item_name === item_name);
            if (contract_row) {
                const remaining_quantity = Math.max(contract_row.quantity - (completed_quantities[item_name] || 0), 0);
                const remaining_amount = Math.max(contract_row.amount - (completed_amounts[item_name] || 0), 0);

                if (item.quantity > remaining_quantity) {
                    throw new Error(`الكمية المدخلة (${item.quantity}) أكبر من الكمية المتبقية (${remaining_quantity}) للعقد الرئيسي.`);
                }

                if (item.amount > remaining_amount) {
                    throw new Error(`المبلغ المدخل (${item.amount}) أكبر من المبلغ المتبقي (${remaining_amount}) للعقد الرئيسي.`);
                }
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function update_contract_values(contract_name) {
    try {
        const contract_doc = await frappe.db.get_doc('Contracts', contract_name);

        if (!contract_doc || !contract_doc.table_itfa) {
            return;
        }

        const subcontracts = await frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'The Subcontracts',
                filters: { contracts: contract_name },
                fields: ['name']
            }
        });

        if (!subcontracts.message.length) {
            return;
        }

        const completed_quantities = {};
        const completed_amounts = {};

        for (const subcontract of subcontracts.message) {
            const subcontract_doc = await frappe.db.get_doc('The Subcontracts', subcontract.name);

            if (!subcontract_doc.items) continue;

            for (const item of subcontract_doc.items) {
                const item_name = item.item_name;

                if (!completed_quantities[item_name]) {
                    completed_quantities[item_name] = 0;
                }
                completed_quantities[item_name] += parseFloat(item.quantity) || 0;

                if (!completed_amounts[item_name]) {
                    completed_amounts[item_name] = 0;
                }
                completed_amounts[item_name] += parseFloat(item.amount) || 0;
            }
        }

        for (const row of contract_doc.table_itfa) {
            const item_name = row.item_name;

            // تحديث نسبة الإنجاز
            const total_completed_quantity = completed_quantities[item_name] || 0;
            const total_completed_amount = completed_amounts[item_name] || 0;

            if (contract_doc.docstatus === 1) {
                row.percentage_of_completion = row.quantity > 0
                    ? ((total_completed_quantity / row.quantity) * 100).toFixed(2)
                    : 0;
            }

            // تحديث الكمية المتبقية
            row.remaining_quantity = Math.max(row.quantity - total_completed_quantity, 0);

            // تحديث المبلغ المتبقي
            row.remaining_amount = Math.max(row.amount - total_completed_amount, 0);
        }

        await frappe.call({
            method: 'frappe.client.save',
            args: { doc: contract_doc }
        });
    } catch (error) {
        console.error(error);
        frappe.msgprint(`حدث خطأ أثناء تحديث العقد الرئيسي: ${error.message}`);
    }
}
