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
                       filters: { }   // لا توجد فلترة، سيتم عرض كل العملاء
                    };
                });
            }
        }
