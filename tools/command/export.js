/**
 * Created by NICK on 16/7/1.
 */

module.exports = exports = (core, program) => {
    let action = (index, type, filename, fields, options) => {
        core.func["export"](index, type, filename, fields, options).then(process.exit, process.exit);
    };

    program
        .command('export <index> <type>  <filename> <fields>')
        .description('导出一个索引数据到CSV文件')
        .action(action);
};