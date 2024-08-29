import React, { useCallback, useState, memo } from 'react';
import cx from 'classnames/bind';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import gClasses from 'scss/Typography.module.scss';
import styles from './AppOrderSetting.module.scss';
import { APP_LIST_COMMON_STRINGS } from '../../AppList.constants';

export const AppOrderSettingsCard = memo(function Card({ id, text, moveCard, findCard, index }) {
    const originalIndex = findCard(id).index;
    const [{ isDragging }, drag] = useDrag(
        () => {
            return {
                type: APP_LIST_COMMON_STRINGS().CARD,
                item: { id, originalIndex },
                collect: (monitor) => {
                    return {
                        isDragging: monitor.isDragging(),
                    };
                },
                end: (item, monitor) => {
                    const { id: droppedId, originalIndex } = item;
                    const didDrop = monitor.didDrop();
                    if (!didDrop) {
                        moveCard(droppedId, originalIndex);
                    }
                },
            };
        },
        [id, originalIndex, moveCard],
    );
    const [, drop] = useDrop(
        () => {
            return {
                accept: APP_LIST_COMMON_STRINGS().CARD,
                hover({ id: draggedId }) {
                    if (draggedId !== id) {
                        const { index: overIndex } = findCard(id);
                        moveCard(draggedId, overIndex);
                    }
                },
            };
        },
        [findCard, moveCard]);

    const opacity = isDragging ? 0 : 1;
    return (
        <div ref={(node) => drag(drop(node))} className={cx(styles.ContainerCard, gClasses.CenterV, gClasses.MB8, gClasses.CursorMove)} style={{ opacity }}>
            <span className={cx(styles.StepperRound, gClasses.FontWeight500, gClasses.FTwo13, gClasses.MX8)}>{index + 1}</span>
            {text}
        </div>
    );
});

export const AppOrderSettingsContainer = memo(function Container(props) {
    const { appOrder, appStateChange } = props;
    const [cards, setCards] = useState(appOrder?.details);
    const findCard = useCallback(
        (id) => {
            const card = cards.filter((c) => `${c.id}` === id)[0];
            return {
                card,
                index: cards.indexOf(card),
            };
        },
        [cards],
    );
    const moveCard = useCallback(
        (id, atIndex) => {
            const { card, index } = findCard(id);
            const updatedCard = update(cards, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, card],
                ],
            });
            appStateChange({ appOrder: { isAppOrderLoading: false, details: updatedCard } });
            setCards(updatedCard);
        },
        [findCard, cards, setCards],
    );
    const [, drop] = useDrop(() => { return { accept: APP_LIST_COMMON_STRINGS().CARD }; });
    return (
        <div ref={drop} className={gClasses.PR30}>
            {cards?.map((card, index) => (
                <AppOrderSettingsCard
                    key={card.id}
                    id={`${card.id}`}
                    text={card.text}
                    index={index}
                    moveCard={moveCard}
                    findCard={findCard}
                />
            ))}
        </div>
    );
});
