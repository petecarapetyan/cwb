import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';

export default /** @type {Partial<import('@rocket/cli').RocketCliOptions>} */ ({
  presets: [rocketLaunch(), rocketSearch()],
});