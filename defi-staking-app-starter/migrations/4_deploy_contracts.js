
const DToken = artifacts.require('DToken');

module.exports = async function(deployer) {
    await deployer.deploy(DToken);
}