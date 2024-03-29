/**
 *          BlockchainController
 * 
 * This class expose the endpoints that the client applications will use to interact with the 
 * Blockchain dataset
 */
class BlockchainController {

    //The constructor receive the instance of the express.js app and the Blockchain class
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        // All the endpoints methods needs to be called in the constructor to initialize the route.
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
        this.requestValidation();
    }

    // Enpoint to validate chain
    requestValidation() {

        this.app.get("/requestValidation", async (req, res) => {
            console.log ("BlockchainController.requestValidation:", "Start..");

            //Validate chain
            let errorBlockList = await this.blockchain.validateChain();

            if (errorBlockList.length == 0) {
                return res.status(200).send("The chain is valid.");
            } else {
                return res.status(404).send("The chain is not valid.");
            }
        });
    }


    // Enpoint to Get a Block by Height (GET Endpoint)
    getBlockByHeight() {

        this.app.get("/block/height/:height", async (req, res) => {
 	    console.log ("BlockchainController.getBlockByHeight:", "Start..");

            if(req.params.height) {
                const height = parseInt(req.params.height);
                let block = await this.blockchain.getBlockByHeight(height);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)
    requestOwnership() {
        this.app.post("/requestOwnership", async (req, res) => {
 	    console.log ("BlockchainController.requestOwnership:", "Start..");

            if(req.body.address) {
                const address = req.body.address;
                const message = await this.blockchain.requestMessageOwnershipVerification(address);
                if(message){
                    return res.status(200).json(message);
                } else {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // Endpoint that allow Submit a Star, yu need first to `requestOwnership` to have the message (POST endpoint)
    submitStar() {
        this.app.post("/submitstar", async (req, res) => {
 	    console.log ("BlockchainController.submitStar:", "Start..");

            if(req.body.address && req.body.message && req.body.signature && req.body.star) {
 	        console.log ("BlockchainController.submitStar:", "valid body structure");

                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                try {
 	            console.log ("BlockchainController.submitStar:", "submitStar..");

                    let block = await this.blockchain.submitStar(address, message, signature, star);
                    if(block){
 	                console.log ("BlockchainController.submitStar:", "SUCCESS");

                        return res.status(200).json(block);
                    } else {
 	                console.log ("BlockchainController.submitStar:", "ERROR 1");

                        return res.status(500).send("An error happened!");
                    }
                } catch (error) {
 	            console.log ("BlockchainController.submitStar:", "ERROR 2");

                    return res.status(500).send(error);
                }
            } else {
 	        console.log ("BlockchainController.submitStar:", "ERROR 3");

                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // This endpoint allows you to retrieve the block by hash (GET endpoint)
    getBlockByHash() {
        this.app.get("/block/hash/:hash", async (req, res) => {
            if(req.params.hash) {
                const hash = req.params.hash;
                let block = await this.blockchain.getBlockByHash(hash);
                if(block){
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // This endpoint allows you to request the list of Stars registered by an owner
    getStarsByOwner() {
        this.app.get("/blocks/:address", async (req, res) => {
            if(req.params.address) {
                const address = req.params.address;
                try {
                    let stars = await this.blockchain.getStarsByWalletAddress(address);
                    if(stars){
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } catch (error) {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

}

module.exports = (app, blockchainObj) => { return new BlockchainController(app, blockchainObj);}
