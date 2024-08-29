import React from 'react';
import cx from 'classnames/bind';

import gClasses from '../../scss/Typography.module.scss';

import CreateMemberComponent from '../admin_settings/user_management/add_or_invite_members/add_member/AddMember';

function CreateMember() {
  return (
    <div className={cx(gClasses.CreateContainerTemp, gClasses.ScrollBar)}>
      <CreateMemberComponent />
    </div>
  );
}
export default CreateMember;
CreateMember.defaultProps = {};
CreateMember.propTypes = {};
