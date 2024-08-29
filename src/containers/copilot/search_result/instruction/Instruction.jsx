import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Title, ETitleHeadingLevel } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from 'scss/Typography.module.scss';
import { COPILOT_STRINGS } from '../../Copilot.strings';
import ResultCard from '../result_card/ResultCard';
import { generateInstructionList } from '../../Copilot.utils';

function Instruction() {
  const { t } = useTranslation();
  const { INSTRUCTION } = COPILOT_STRINGS(t);
  const instructionList = generateInstructionList(t);

  return (
    <div className={cx(gClasses.BackgroundWhite)}>
      <Title
        content={INSTRUCTION.TITLE}
        headingLevel={ETitleHeadingLevel.h4}
        className={cx(gClasses.FTwo21GrayV3, gClasses.MB10)}
      />
      <div
        className={cx(
          gClasses.DisplayFlex,
          gClasses.FlexDirectionColumn,
          gClasses.Gap8,
          gClasses.WidthMaxContent,
        )}
      >
        {instructionList.map((instruction) => (
          <ResultCard
            key={instruction.id}
            data={instruction}
            isInstruction
          />
        ))}
      </div>
    </div>
  );
}

export default Instruction;
