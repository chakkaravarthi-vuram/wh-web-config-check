const BILLING_PLANS_STRING = {
    UPGRADE_PLAN: 'billing_module.billing_plans_string.upgrade_plan',
    UPGRADE_SUB_HEADING: 'billing_module.billing_plans_string.upgrade_sub_heading',
    FREE_TRIAL: 'billing_module.billing_plans_string.free_trail',
    BEST_FOR_PERSONAL: 'billing_module.billing_plans_string.best_for_personal',
    RUPEES: '₹',
    DOLLAR: '$',
    ZERO: '0',
    PER_MEMBER_7: 'billing_module.billing_plans_string.per_member_7',
    REMAINING_DAYS: 'billing_module.billing_plans_string.remaining_days',
    UPGRADE_NOW: 'billing_module.billing_plans_string.upgrade_now',
    WILL_UPGRADE: 'billing_module.billing_plans_string.will_upgrate',
    SIGN_OUT: 'billing_module.billing_plans_string.sign_out',
    PER_MEMBER_PER_MONTH: 'billing_module.billing_plans_string.per_member',
    YOUR_TRIAL_EXPIRED: 'billing_module.billing_plans_string.your_trail_expired',
    TRIAL_EXPIRED: 'billing_module.billing_plans_string.trial_expires',
    OR: 'billing_module.billing_plans_string.or',
    CONTACT_SALES: 'billing_module.billing_plans_string.contact_sales',
    SALE_MAIL_ID: 'ask@workhall.com',
    CURRENT_PLAN: 'billing_module.billing_plans_string.current_plan',
    STANDARD_PLAN: 'billing_module.billing_plans_string.standard_plan',
    DESCRIPTION: 'billing_module.billing_plans_string.description',
};

export const FREE_SALES_CONDITION = (t) => [`7 ${t('billing_module.billing_plans_string.free_sales_condition.days')}`, `5 ${t('billing_module.billing_plans_string.free_sales_condition.users')}`, `3 ${t('billing_module.billing_plans_string.free_sales_condition.flows')}`, `3 ${t('billing_module.billing_plans_string.free_sales_condition.datalists')}`];
export const COST_SALES_CONDITION = (t) => [t('billing_module.billing_plans_string.cost_sales_condition.unlimited_storage'), t('billing_module.billing_plans_string.cost_sales_condition.all_report'), t('billing_module.billing_plans_string.cost_sales_condition.custom_fields'), t('billing_module.billing_plans_string.cost_sales_condition.set_permission'), t('billing_module.billing_plans_string.cost_sales_condition.recurring_task'), t('billing_module.billing_plans_string.cost_sales_condition.delegated_reminders')];
export default BILLING_PLANS_STRING;
