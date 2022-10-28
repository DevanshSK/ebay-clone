import React from "react";
import Header from "../components/Header";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";

type Props = {};

function Create({}: Props) {
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  console.log(contract);

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border mt-2">
        <h1 className="text-3xl sm:text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold my-4">
          Select an Item you would like to sell!!
        </h2>

        <hr className="my-4" />

        <p>Below you will find out the NFT's you own in your wallet</p>
      </main>
    </div>
  );
}
export default Create;
