import del from 'del';
import { paths, config } from './config';

export function clean() {
    const sitePaths = [`${paths.site}**/*`];

    return del(config.prod
        ? [paths.dest]
        : [...sitePaths], { force: true });
}
