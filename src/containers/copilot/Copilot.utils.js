import { COPILOT_STRINGS, RESULT_TYPE } from './Copilot.strings';

export const generateInstructionList = (t, search = null) => {
  const { INSTRUCTION: { COPILOT_LIST, TASK_LIST } } = COPILOT_STRINGS(t);
  const instructionList = [];

  let copilotList = COPILOT_LIST;
  let taskList = TASK_LIST;
  if (search) {
    const searchLower = search.toLowerCase();
    const copilotInc = COPILOT_LIST.filter((inc) => inc.toLowerCase().includes(searchLower));
    if (copilotInc.length > 0) {
      copilotList = copilotInc;
    }
    const taskInc = TASK_LIST.filter((inc) => inc.toLowerCase().includes(searchLower));
    if (taskInc.length > 0) {
      taskList = taskInc;
    }
  }

  const rowLength = 4;
  const halfRow = Math.round(rowLength / 2);
  for (let row = 0; row < rowLength; row++) {
    const instruction = {
      id: row + 1,
    };
    if (halfRow > row) {
      instruction.name = copilotList[row];
      instruction.type = RESULT_TYPE.COPILOT;
    } else {
      instruction.name = taskList[row - halfRow];
      instruction.type = RESULT_TYPE.TASK;
    }
    if (instruction.name) {
      instructionList.push(instruction);
    }
  }

  return instructionList;
};
