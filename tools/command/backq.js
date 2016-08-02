/**
 * Created by NICK on 16/7/1.
 */

module.exports = exports = (core, program) => {
    let action = (key, options) => {
        core.func.backq(key, options).then(process.exit, process.exit);
    };

    program
        .command('backq <key>')
        .option('-i, --interval <n>', '等待时间')
        .description('回滚queue')
        .action(action);
};