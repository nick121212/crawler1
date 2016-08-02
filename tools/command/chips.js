/**
 * Created by NICK on 16/7/1.
 */

module.exports = exports = (core, program) => {
    let action = (options) => {
        core.func.chips(options);
    };

    program
        .command('chips')
        .description('动态更换ip')
        .action(action);
};