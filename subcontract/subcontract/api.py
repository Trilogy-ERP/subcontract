def update_contract_completion_percentage(doc, method):
    if doc.contracts:
        update_percentage_of_completion(doc.contracts)
