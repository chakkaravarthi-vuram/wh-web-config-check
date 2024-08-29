import { NAVBAR } from 'redux/actions/ActionConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

const initialState = {
    isNavOpen: true,
    isNavVisible: true,
    isModalOpen: false,
    originalLocation: EMPTY_STRING,
    isTrialDisplayed: null,
    commonHeader: {
        tabOptions: [],
        button: null,
    },
  };

const NavBarReducer = (state = initialState, action) => {
switch (action.type) {
    case NAVBAR.TOGGLE:
        return { ...state,
            isNavOpen: !state.isNavOpen,
            isNavVisible: true,
        };
    case NAVBAR.DATA_CHANGE:
        console.log('commonHeadercomponent Navbarheaderchange outside', action, state);
        return { ...state, ...action.payload };
        case NAVBAR.TOGGLE_CLOSE:
            return { ...state,
                isNavOpen: true,
            };
        case NAVBAR.COMMON_HEADER_CHANGE:
        console.log('commonHeadercomponent Navbarheaderchange', action.payload);
            return { ...state,
                commonHeader: action.payload,
                isNavOpen: state.isNavOpen,
             };
    default:
        return { ...state };
    }
};

export default NavBarReducer;
