import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-grid-layout/css/styles.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import { useHistory } from 'react-router';
import CompListingPopper from './app_component_listing/AppComponentListing';
import { AppBuilderElementList, APP_COMP_STRINGS } from './AppBuilder.strings';
import { POPPER_PLACEMENTS } from '../../../components/auto_positioning_popper/AutoPositioningPopper';
import AppComponents from '../app_components/AppComponent';
import gClasses from '../../../scss/Typography.module.scss';
import style from './AppBuilder.module.scss';
import ExpandIcon from '../../../assets/icons/app_builder_icons/ExpandIcon';
import { isBasicUserMode } from '../../../utils/UtilityFunctions';
import { APP_COMPONENT_TYPE } from '../app_components/AppComponent.constants';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function AppBuilderLayout(props) {
    const { t } = useTranslation();
    const {
        layouts,
        layoutmain,
        onLayoutChange,
        onAdddComp,
        appBuilderDimensions,
        mounted,
        onDrop,
        onComponentEdit,
        isBasicUser,
        currentPageDetails = {},
        heightReference,
        } = props;

    const [isPopperOpen, setPopperOpen] = useState(false);
    const [popperIndex, setPopperIndex] = useState(0);
    const [popperDetails, setPopperDetails] = useState(null);
    const [hover, setHover] = useState(-1);
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);

    const closeListPopper = () => {
        setPopperOpen(false);
        setPopperIndex(-1);
    };

    const onAddCLick = (index) => {
        setPopperOpen(true);
        setPopperIndex(index);
        setPopperDetails(`layout${index}`);
    };

    const customStyle = {};
    if (!isNormalMode) customStyle.height = heightReference;

    const matrixLayout = (layouts) => {
        const matrixLayout = [];
        layouts?.forEach((layoutData) => {
            const { x, y } = layoutData;
            if (matrixLayout[layoutData.y]) matrixLayout[y][x] = layoutData;
            else {
                const { x, y } = layoutData;
                matrixLayout[y] = [];
                matrixLayout[y][x] = layoutData;
            }
        });
        return matrixLayout?.flatMap((data) => data) || [];
    };

    return (
        <div className={cx(BS.P_RELATIVE, gClasses.ZIndex2)}>
            {/* <div className={style.RglContainer}>
                <div className={style.RglBg}>

                </div> */}
            <ResponsiveReactGridLayout
                {...appBuilderDimensions}
                // style={{ background: '#f0f0f0' }}
                layouts={layouts}
                // layout={}
                measureBeforeMount={false}
                className={style.Layout}
                style={customStyle}
                useCSSTransforms={mounted}
                compactType="vertical"
                // preventCollision={!compactType}
                onLayoutChange={onLayoutChange}
                resizeHandles={['se']}
                // resizeHandle={<BottomRightHandle />}
                // resizeHandle={(handleAxis, ref) => <ExpandIcon ref={ref} handleAxis={handleAxis} className={cx(style.ResizeHandle)} />}
                // onDrop={onDrop}
                // droppingItem={{ i: 'xx', h: 2, w: 2 }}
                // isDroppable
                onDrop={onDrop}
                isDroppable={!isBasicUser}
                // droppingItem={{ i: layoutmain.length, w: 2, h: 2 }}
            >
                {(isNormalMode ? matrixLayout(layoutmain) : layoutmain)?.map((layout, index) => (
                    // <>
                        <div
                            key={layout.i}
                            data-grid={layout}
                            className={popperIndex === index && gClasses.ZIndex10}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(-1)}
                        >
                            <div className={cx(BS.W100, BS.H100, style.AppCompBorder, { [style.OverFlowHidden]: layout.type === APP_COMPONENT_TYPE.IMAGE })} style={{ background: (layout.type === APP_COMP_STRINGS.ADD) ? null : 'white' }}>
                                <AppComponents isHoververd={hover === index} onComponentEdit={onComponentEdit} isBasicUser={isBasicUser} compLayout={layout} addId={`layout${index}`} onAddComponentClick={() => onAddCLick(index)} componentType={layout.type} currentPageName={currentPageDetails?.labelText} />
                            </div>
                            {popperIndex === index &&
                            <CompListingPopper
                                list={AppBuilderElementList(t)}
                                isPopperOpen={isPopperOpen}
                                closeListPopper={closeListPopper}
                                referencePopperElement={document.getElementById(popperDetails)}
                                popperPlacement={POPPER_PLACEMENTS.AUTO}
                                onAddClick={(type, index) => { onAdddComp(type, index); setPopperOpen(false); }}
                                componentIndex={layoutmain.length}
                            />}
                            {hover === index && !isBasicUser && <ExpandIcon className={cx(style.ResizeHandle)} />}
                        </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
}

export default React.memo(AppBuilderLayout);
