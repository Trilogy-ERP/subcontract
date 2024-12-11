app_name = "subcontract"
app_title = "subcontract"
app_publisher = "aya"
app_description = "subcontrac"
app_email = "aya@gmail.com"
app_license = "mit"

doctype_js = {
    "The Subcontracts": "public/js/the_subcontracts.js",
    "Payment Entry": "public/js/update_payment.js"
}

override_doctype_class = {
"Payment Entry": "subcontract.overrides.payment_entry.CustomPaymentEntry"
}
override_whitelisted_methods = {
    "erpnext.accounts.doctype.payment_entry.payment_entry.make_payment_entry": 
    "subcontract.subcontract.overrides.payment_entry.make_payment_entry"
    # "subcontract.subcontract.overrides.payment_entry.CustomPaymentEntry.on_submit"

}
# override_doctype_dashboards = {
#     "The Subcontracts": "subcontract.overrides.payment_entry"
# }


# doc_events = {
#     "Payment Entry": {
#         "on_submit": "subcontract.subcontract.payment_entry.update_subcontract_status"
#     }
# }


# doc_events = {
#     "Contracts": {
#         "on_update": "subcontract.api.update_percentage_of_completion"
#     }
# }



# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "subcontract",
# 		"logo": "/assets/subcontract/logo.png",
# 		"title": "subcontract",
# 		"route": "/subcontract",
# 		"has_permission": "subcontract.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/subcontract/css/subcontract.css"
# app_include_js = "/assets/subcontract/js/subcontract.js"

# include js, css files in header of web template
# web_include_css = "/assets/subcontract/css/subcontract.css"
# web_include_js = "/assets/subcontract/js/subcontract.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "subcontract/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "subcontract/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "subcontract.utils.jinja_methods",
# 	"filters": "subcontract.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "subcontract.install.before_install"
# after_install = "subcontract.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "subcontract.uninstall.before_uninstall"
# after_uninstall = "subcontract.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "subcontract.utils.before_app_install"
# after_app_install = "subcontract.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "subcontract.utils.before_app_uninstall"
# after_app_uninstall = "subcontract.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "subcontract.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"subcontract.tasks.all"
# 	],
# 	"daily": [
# 		"subcontract.tasks.daily"
# 	],
# 	"hourly": [
# 		"subcontract.tasks.hourly"
# 	],
# 	"weekly": [
# 		"subcontract.tasks.weekly"
# 	],
# 	"monthly": [
# 		"subcontract.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "subcontract.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "subcontract.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "subcontract.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["subcontract.utils.before_request"]
# after_request = ["subcontract.utils.after_request"]

# Job Events
# ----------
# before_job = ["subcontract.utils.before_job"]
# after_job = ["subcontract.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"subcontract.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

