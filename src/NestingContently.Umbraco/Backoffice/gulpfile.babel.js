import gulp from 'gulp';
import { paths, config } from './gulp/config';
import { js } from './gulp/js';

// entry points... 
export const prod = gulp.task('build',
  gulp.series(
    done => {
      config.prod = true,
        done();
    },
    js));

export const dev = gulp.task('dev',
  gulp.parallel(
    js,
    done => {
      console.log('watching for changes... ctrl+c to exit');
      gulp.watch(paths.js, js);
      done();
    }
  ));
