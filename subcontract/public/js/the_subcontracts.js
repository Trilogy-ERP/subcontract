// frappe.ui.form.on('The Subcontracts', {
//     after_save: function (frm) {
//         // استدعاء الدالة لتحديث نسبة الإنجاز
//         if (frm.doc.contracts) {
//             update_percentage_of_completion(frm.doc.contracts);
//         } else {
//             frappe.msgprint('لا يوجد عقد رئيسي مرتبط بهذا العقد الفرعي.');
//         }
//     }
// });


// frappe.ui.form.on('The Subcontracts', {
//     after_save: function (frm) {
//         // استدعاء الدالة لتحديث نسبة الإنجاز
//         if (frm.doc.contracts) {
//             update_percentage_of_completion(frm.doc.contracts);
//         } else {
//             frappe.msgprint('لا يوجد عقد رئيسي مرتبط بهذا العقد الفرعي.');
//         }
//     }
// });

// // تعريف الدالة update_percentage_of_completion
// async function update_percentage_of_completion(contract_name) {
//     try {
//         // التحقق من وجود العقد الرئيسي
//         const contract_doc = await frappe.db.get_doc('Contracts', contract_name);

//         if (!contract_doc) {
//             frappe.msgprint(`العقد بالاسم ${contract_name} غير موجود.`);
//             return;
//         }

//         frappe.msgprint(`العقد الرئيسي: ${contract_name}`);
//         frappe.msgprint(`العناصر في العقد الرئيسي:`);

//         // التأكد من وجود عناصر في جدول table_itfa
//         if (!contract_doc.table_itfa || contract_doc.table_itfa.length === 0) {
//             frappe.msgprint(`لا توجد عناصر في جدول table_itfa للعقد ${contract_name}.`);
//             return;
//         }

//         // طباعة تفاصيل العناصر في العقد الرئيسي
//         contract_doc.table_itfa.forEach(row => {
//             frappe.msgprint(`- العنصر: ${row.business_item}, الكمية المطلوبة: ${row.quantity}`);
//         });

//         // استعلام لجلب العقود الفرعية المرتبطة بالعقد الرئيسي
//         const subcontracts = await frappe.call({
//             method: 'frappe.client.get_list',
//             args: {
//                 doctype: 'The Subcontracts', // جدول العقود الفرعية
//                 filters: { contracts: contract_name }, // فلترة بالعقد الرئيسي
//                 fields: ['name'] // جلب أسماء العقود الفرعية فقط
//             }
//         }).catch(() => {
//             frappe.msgprint(`خطأ في الوصول إلى العقود الفرعية.`);
//             return { message: [] };
//         });

//         if (!subcontracts || !subcontracts.message || subcontracts.message.length === 0) {
//             frappe.msgprint(`لا توجد عقود فرعية مرتبطة بالعقد ${contract_name}.`);
//             return;
//         }

//         frappe.msgprint(`تم العثور على ${subcontracts.message.length} عقد فرعي مرتبط بالعقد الرئيسي.`);

//         // جمع الكميات المنجزة من العقود الفرعية
//         const completed_quantities = {};
//         for (let subcontract of subcontracts.message) {
//             const subcontract_doc = await frappe.db.get_doc('The Subcontracts', subcontract.name);

//             if (!subcontract_doc || !subcontract_doc.items || subcontract_doc.items.length === 0) {
//                 frappe.msgprint(`العقد الفرعي ${subcontract.name} لا يحتوي على عناصر.`);
//                 continue;
//             }

//             frappe.msgprint(`العقد الفرعي: ${subcontract.name}`);
//             for (let item of subcontract_doc.items) {
//                 if (!completed_quantities[item.business_item]) {
//                     completed_quantities[item.business_item] = 0;
//                 }
//                 completed_quantities[item.business_item] += parseFloat(item.quantity) || 0; // جمع الكميات المنجزة
//                 frappe.msgprint(`- العنصر: ${item.business_item}, الكمية المنجزة: ${item.quantity}, الإجمالي حتى الآن: ${completed_quantities[item.business_item]}`);
//             }
//         }

//         // حساب النسب المئوية لكل عنصر في العقد الرئيسي
//         frappe.msgprint(`\nحساب النسب المئوية للعناصر في العقد الرئيسي:`);
//         for (let row of contract_doc.table_itfa) {
//             const total_completed = completed_quantities[row.business_item] || 0; // الكمية المنجزة
//             row.percentage_of_completion = row.quantity > 0 
//                 ? ((total_completed / row.quantity) * 100).toFixed(2) 
//                 : 0; // حساب النسبة المئوية

//             frappe.msgprint(`- العنصر: ${row.business_item}, الكمية المطلوبة: ${row.quantity}, الكمية المنجزة: ${total_completed}, النسبة المئوية: ${row.percentage_of_completion}%`);
//         }

//         // حفظ التعديلات في العقد الرئيسي
//         await frappe.call({
//             method: 'frappe.client.save',
//             args: {
//                 doc: contract_doc
//             }
//         });

//         frappe.msgprint(`تم تحديث حقل percentage_of_completion في جميع العناصر.`);
//     } catch (error) {
//         frappe.msgprint(`حدث خطأ أثناء تنفيذ الدالة: ${error.message}`);
//     }
// }








// // تعريف الدالة update_percentage_of_completion
// // async function update_percentage_of_completion(contract_name) {
// //     try {
// //         // التحقق من وجود العقد الرئيسي
// //         const contract_doc = await frappe.db.get_doc('Contracts', contract_name);

// //         if (!contract_doc) {
// //             frappe.msgprint(`العقد بالاسم ${contract_name} غير موجود.`);
// //             return;
// //         }

// //         frappe.msgprint(`العقد الرئيسي: ${contract_name}`);
// //         frappe.msgprint(`العناصر في العقد الرئيسي:`);

// //         // التأكد من وجود عناصر في جدول table_itfa
// //         if (!contract_doc.table_itfa || contract_doc.table_itfa.length === 0) {
// //             frappe.msgprint(`لا توجد عناصر في جدول table_itfa للعقد ${contract_name}.`);
// //             return;
// //         }

// //         // طباعة تفاصيل العناصر في العقد الرئيسي
// //         contract_doc.table_itfa.forEach(row => {
// //             frappe.msgprint(`- العنصر: ${row.business_item}, الكمية المطلوبة: ${row.quantity}`);
// //         });

// //         // استعلام لجلب العقود الفرعية المرتبطة بالعقد الرئيسي
// //         const subcontracts = await frappe.call({
// //             method: 'frappe.client.get_list',
// //             args: {
// //                 doctype: 'The Subcontracts', // جدول العقود الفرعية
// //                 filters: { contracts: contract_name }, // فلترة بالعقد الرئيسي
// //                 fields: ['name'] // جلب أسماء العقود الفرعية فقط
// //             }
// //         }).catch(() => {
// //             frappe.msgprint(`خطأ في الوصول إلى العقود الفرعية.`);
// //             return { message: [] };
// //         });

// //         if (!subcontracts || !subcontracts.message || subcontracts.message.length === 0) {
// //             frappe.msgprint(`لا توجد عقود فرعية مرتبطة بالعقد ${contract_name}.`);
// //             return;
// //         }

// //         frappe.msgprint(`تم العثور على ${subcontracts.message.length} عقد فرعي مرتبط بالعقد الرئيسي.`);

// //         // جمع الكميات المنجزة من العقود الفرعية
// //         const completed_quantities = {};
// //         for (let subcontract of subcontracts.message) {
// //             const subcontract_doc = await frappe.db.get_doc('The Subcontracts', subcontract.name);

// //             if (!subcontract_doc || !subcontract_doc.items || subcontract_doc.items.length === 0) {
// //                 frappe.msgprint(`العقد الفرعي ${subcontract.name} لا يحتوي على عناصر.`);
// //                 continue;
// //             }

// //             frappe.msgprint(`العقد الفرعي: ${subcontract.name}`);
// //             for (let item of subcontract_doc.items) {
// //                 if (!completed_quantities[item.business_item]) {
// //                     completed_quantities[item.business_item] = 0;
// //                 }
// //                 completed_quantities[item.business_item] += parseFloat(item.quantity) || 0; // جمع الكميات المنجزة
// //                 frappe.msgprint(`- العنصر: ${item.business_item}, الكمية المنجزة: ${item.quantity}, الإجمالي حتى الآن: ${completed_quantities[item.business_item]}`);
// //             }
// //         }

// //         // حساب النسب المئوية لكل عنصر في العقد الرئيسي
// //         frappe.msgprint(`\nحساب النسب المئوية للعناصر في العقد الرئيسي:`);
// //         for (let row of contract_doc.table_itfa) {
// //             const total_completed = completed_quantities[row.business_item] || 0; // الكمية المنجزة
// //             row.percentage_of_completion = row.quantity > 0 
// //                 ? ((total_completed / row.quantity) * 100).toFixed(2) 
// //                 : 0; // حساب النسبة المئوية

// //             frappe.msgprint(`- العنصر: ${row.business_item}, الكمية المطلوبة: ${row.quantity}, الكمية المنجزة: ${total_completed}, النسبة المئوية: ${row.percentage_of_completion}%`);
// //         }

// //         // حفظ التعديلات في العقد الرئيسي
// //         await frappe.call({
// //             method: 'frappe.client.save',
// //             args: {
// //                 doc: contract_doc
// //             }
// //         });

// //         frappe.msgprint(`تم تحديث حقل percentage_of_completion في جميع العناصر.`);
// //     } catch (error) {
// //         frappe.msgprint(`حدث خطأ أثناء تنفيذ الدالة: ${error.message}`);
// //     }
// // }



