/**
 * Created by NICK on 16/7/1.
 */

module.exports = exports = (core, program) => {
    let action = (index, type, filename, options) => {
        core.func["export"](index, type, filename, options).then(process.exit, process.exit);
    };

    program
        .command('export <index> <type> <filename>')
        .description('导出一个索引数据到CSV文件')
        .action(action);
};