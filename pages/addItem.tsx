import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import { useContract, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

type Props = {};

function addItem({}: Props) {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  // console.log(address);

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
      alert("Please select an Image");
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };

    try {
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt;
      const tokenId = tx.id;
      const nft = await tx.data();
      // console.log(receipt, tokenId, nft);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border mt-2">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Add an Item to the Marketplace
        </h1>
        <h2 className="text-xl font-semibold mt-4">Item Details</h2>
        <p className="mt-2 mb-5">
          By adding an itam into the marketplace, you're essentially Minting an
          NFT of the item into your wallet which we can then list for sale!
        </p>

        <div className="flex pt-5 flex-col justify-center items-center md:flex-row md:space-x-5">
          <img
            className="border h-80 w-80 object-contain"
            src={preview || "https://links.papareact.com/ucj"}
            alt=""
          />

          <form
            onSubmit={mintNft}
            className="w-full flex flex-col flex-1 p-2 space-y-4 ms:space-y-3 "
          >
            <label className="font-light">Name of Item</label>
            <input
              className="formField"
              placeholder="Name of Item..."
              type="text"
              id="name"
              name="name"
            />

            <label className="font-light">Description</label>
            <input
              className="formField"
              placeholder="Enter Descriptions..."
              type="text"
              name="description"
              id="description"
            />

            <label className="font-light">Image of Item</label>
            <input
              placeholder="Enter Descriptions..."
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />

            <button
              type="submit"
              className="bg-blue-600 font-bold text-white py-4 rounded-full px-10 sm:w-56 md:mt-auto self-stretch md:self-end"
            >
              Add/Mint Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;
