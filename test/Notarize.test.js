import('chai');
const {
    BN,
    constants,
    expectEvent,
    expectRevert,
    time,
} = require('@openzeppelin/test-helpers');

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const Notarize = artifacts.require("Notarize");

const { ZERO_ADDRESS } = constants;

const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());

const HashWriter = "0x9bd7b39e404ec8163ddb5278c0044198ca50a2bf864985cbc93f934a5afed5d6";
const DefaultAdminRole = "0x0000000000000000000000000000000000000000000000000000000000000000";
const hash1 = "0xe4bddbce933ab5309ed9a33dfcb263431409a97b487c35bb5f3558fbc9f56e6f";
const hash2 = "0x1bbe558666965977a93d52d8679613c43a6541099b91ebb87d62e0d05e1c7fc1";

contract('Notarization Test', async function (accounts){
    const Admin = accounts[0];
    const HashWriter1 = accounts[1];
    
    it("Retrive contract", async function () {
        NotarizeContract = await Notarize.deployed()
        expect(NotarizeContract.address).to.be.not.equal(ZERO_ADDRESS);
        expect(NotarizeContract.address).to.match(/0x[0-9a-fA-F]{40}/);
    });

    it("Contract admin assign hash writer role to account1", async function () {
        await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}),
            "AccessControl: account " + HashWriter1.toLowerCase() + " is missing role " + DefaultAdminRole);
        await NotarizeContract.setHashWriterRole(HashWriter1, {from: Admin});
        expect(await NotarizeContract.hasRole(HashWriter, HashWriter1)).to.be.true;
    });

    it("A hash writer address cannot assign the same role to another address", async function () {
        await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}),
            "AccessControl: account " + HashWriter1.toLowerCase() + " is missing role " + DefaultAdminRole);
    });
    
    it("An Admin address cannot notarize a document", async function () {
        await expectRevert(NotarizeContract.addNewDocument("Example", hash1, {from: Admin}),
            "AccessControl: account " + Admin.toLowerCase() + " is missing role " + HashWriter);
    });

});


