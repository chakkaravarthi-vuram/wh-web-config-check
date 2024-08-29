import Joi from 'joi';
import {
    constructJoiObject,
} from '../../../../utils/ValidationConstants';
import { getWebpageEmbedStrings } from './WebpageEmbedSettings.strings';

export const embedUrlValidationSchema = (t) => constructJoiObject({
    embed_url_origin: Joi.string().uri({ scheme: ['https'] }).label(getWebpageEmbedStrings(t).NEW_EMBED_URL_INPUT.PLACEHOLDER).required(),
});

export default embedUrlValidationSchema;
