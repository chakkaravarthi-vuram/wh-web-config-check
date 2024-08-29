import React, { useState } from 'react';
import PlusIconWhite from 'assets/icons/parallel_flow/PlusIconWhite';
import styles from './custom_nodes/step_card/StepCard.module.scss';

function AddFlow(props) {
    const { className, displayDropdownNode, xAdd, yAdd } = props;
    const [referencePopper, setReferencePopper] = useState(null);
    const onPlusButtonClick = (e) => {
        e.stopPropagation();
        displayDropdownNode({ ref: referencePopper, xAdd, yAdd });
    };
    return (
            <div className={className}>
                <div ref={setReferencePopper}>
                <PlusIconWhite onClick={onPlusButtonClick} className={styles.PlusIcon} />
                </div>
            </div>
    );
}

export default AddFlow;
