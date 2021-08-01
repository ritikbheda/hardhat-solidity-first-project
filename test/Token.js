const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Token contract", function() {
    
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addr3;


    this.beforeEach( async function() {
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        hardhatToken = await Token.deploy();
    })
    
    describe("Deployment", function() {

        it("Should set the right owner", async function() {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of token to the owner", async function() {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });

    });

    describe("Transactions", function (){
        it("Should transfer tokens between accounts", async function() {
            await hardhatToken.transfer(addr1.address, 50);
            const address1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(address1Balance).to.equal(50);

            await hardhatToken.connect(addr1).transfer(addr2.address, 50);
            const address2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(address2Balance).to.equal(50);
        });

        it("Should fail if sender does not have enough tokens", async function() {
            const initalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.revertedWith("Not enough tokens");

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initalOwnerBalance);
        });

        it("Should update balances after transfers", async function(){
            const initalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address, 50);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

            await hardhatToken.connect(addr1).transfer(addr2.address, 50);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initalOwnerBalance - 50);
        })
    });
    
    // it("Deployment should assign the total supply of tokens to the owner", async function (){
    //     const [owner] = await ethers.getSigners();
    //     const token = await ethers.getContractFactory("Token");
    //     const hardhatToken = await token.deploy();
    //     const ownerBalance = await hardhatToken.balanceOf(owner.address);
    //     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    // })
})

