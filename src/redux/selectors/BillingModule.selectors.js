export const getPaymentUserDetailsSelctors = (
  paymentUsers,
  t,
  // accountId, id
  ) => {
  const billing_owners = paymentUsers.paymentUsers.DETAILS.map((value) => {
    // let first_name = value.NAME?value.NAME.split('')[0]:value.first_name;
    // let last_name = value.NAME?value.NAME.split('')[1]:value.last_name;
    console.log('hittedd', paymentUsers.paymentUsers.DETAILS);
    return {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.EMAIL,
      is_primary_contact: value.TYPE === t('billing_module.billing_role.primary'),
      ...(value.is_workhall && { user_id: value.user_id }),
      ...(!value.is_active && { is_active: value.is_active }),
      user_id: value.user_id,
    };
  });
  return {
    // _id: id,
    // account_id: accountId,
    billing_owners,
  };
};

export const getAddNewPaymentUser = (
  userData,
  // billing_owners,
  ) => {
  const apiBillingOwner = userData && userData.map((selectedUser) => {
    const userData = {};
    userData.email = selectedUser.email;
    userData.user_id = selectedUser.user._id;
    userData.first_name = selectedUser.user.first_name;
    userData.last_name = selectedUser.user.last_name;
    userData.is_primary_contact = selectedUser.userRole === 'Primary';
    return userData;
  });

  return { billing_owners: apiBillingOwner };
};
