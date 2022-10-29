import React, { FormEvent, useState } from "react";
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
import {
  ChainId,
  NFT,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";

type Props = {};

function Create({}: Props) {
  const address = useAddress();
  const router = useRouter();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const [selectedNft, setSelectedNft] = useState<NFT>();

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const ownedNfts = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading: isLoadingDirect,
    error: isErrorDirect,
  } = useCreateDirectListing(contract);
  const {
    mutate: createAuctionListing,
    isLoading,
    error,
  } = useCreateAuctionListing(contract);

  // This funtion gets called when the form is submitted
  // The user has provided:
  // - contract Address
  // - token ID
  // - type of listing
  // - price of nft
  // This funtion gets called when the form is submitted
  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          startTimestamp: new Date(),
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          buyoutPricePerToken: price?.value,
        },
        {
          onSuccess(data, variables, context) {
            // console.log("SUCCESS : ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR : ", error, variables, context);
          },
        }
      );
    }
    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          startTimestamp: new Date(),
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          buyoutPricePerToken: price.value,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            // console.log("SUCCESS : ", data, variables, context);
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR : ", error, variables, context);
          },
        }
      );
    }
  };

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

        <div className="flex overflow-x-scroll space-x-5 p-4 ">
          {ownedNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => setSelectedNft(nft)}
              className={`flex flex-col space-y-2 card  border-2 bg-gray-100 max-w-[16rem] ${
                nft.metadata.id === selectedNft?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-lg flex-shrink-0 object-contain w-full"
                src={nft.metadata.image}
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-sm truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col px-2 py-10 sm:px-10">
              <div className="grid grid-cols-price gap-5 items-center justify-items-stretch">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="directListing"
                  className="ml-auto w-5 h-5 md:h-10 md:w-10"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                  className="ml-auto w-5 h-5 md:h-10 md:w-10"
                />

                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  placeholder="0.05"
                  name="price"
                  className="bg-gray-100 p-5"
                />
              </div>

              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
export default Create;
