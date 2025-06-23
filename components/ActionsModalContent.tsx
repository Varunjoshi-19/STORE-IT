import { Models } from "node-appwrite"
import Thumbnail from "./Thumbnail"
import FormttedDateTime from "./FormttedDateTime"
import { convertFileSize, formatDateTime } from "@/lib/utils"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

interface Props {
    file: Models.Document,
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email: string) => void;
}

const ImageThumbNail = ({ file }: { file: Models.Document }) => {

    return (
        <div className="file-details-thumbnail">
            <Thumbnail type={file.type} extension={file.extension} url={file.url} />
            <div className="flex flex-col">
                <p className="subtitle-2 mb-1">{file.name}</p>
                <FormttedDateTime date={file.$createdAt} className="caption" />
            </div>
        </div>
    )

}

const DetailRow = ({ label, value }: { label: string, value: string }) => {

    return (
        <div className="flex">
            <p className="file-details-label text-left">{label}</p>
            <p className="file-details-value text-left">{value}</p>
        </div>
    )
}


export const FileDetails = ({ file }: { file: Models.Document }) => {

    return (
        <>
            <ImageThumbNail file={file} />
            <div className="space-y-4 px-2 pt-2">
                <DetailRow label="Format:" value={file.extension} />
                <DetailRow label="Size:" value={convertFileSize(file.size)} />
                <DetailRow label="Owner:" value={file.owner.fullName} />
                <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
            </div>

        </>
    )
}


export function ShareInput({ file, onInputChange, onRemove }: Props) {
    return (
        <>
            <ImageThumbNail file={file} />

            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">Share file with other users</p>
                <Input type="email" placeholder="Enter user email"
                    className="share-input-field"
                    onChange={(e) => onInputChange(e.target.value.split(","))} />
                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">Shared with</p>
                        <p className="subtitle-2 text-light-200">{file.users.length}</p>
                    </div>

                    <ul className="pt-2">
                        {file.users.map((email: string, index: number) => (
                            <li className="flex items-center justify-between gap -2" key={email}>
                                <p className="subtitle-2">{email}</p>
                                <Button onClick={() => onRemove(email)} className="share-remove-user">
                                    <Image
                                        src="/assets/icons/remove.svg"
                                        alt="Remove"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

