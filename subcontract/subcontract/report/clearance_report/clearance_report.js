// Copyright (c) 2024, aya and contributors
// For license information, please see license.txt

// frappe.query_reports["Contracts Summary"] = {
//     filters: [
//         {
//             fieldname: "contract_name",
//             label: "العقد الرئيسي",
//             fieldtype: "Link",
//             options: "Contracts",
//             reqd: 1, // هذا الحقل مطلوب لتشغيل التقرير
//             get_query: () => {
//                 return {
//                     filters: {
//                         // إذا كنت تريد تحديد أي شروط لجلب العقود، أضفها هنا
//                     }
//                 };
//             }
//         }
//     ]
// };

function displaySubcontractDetails(selectElement) {
    var selectedSubcontract = selectElement.value;
    
    // لا تفعل شيئاً عند الضغط على أي عقد فرعي، فقط عرض عدد العقود الفرعية
    if (!selectedSubcontract) {
        return; // إذا لم يتم تحديد أي عقد فرعي، لا تفعل شيئاً
    }
    
    // هنا يمكنك إضافة كود إذا كنت ترغب في تنفيذ شيء معين عند الضغط على عقد فرعي (لكن حالياً لا يوجد شيء سيحدث)
}
