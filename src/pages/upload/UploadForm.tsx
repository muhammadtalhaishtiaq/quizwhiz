import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, Youtube, Link as LinkIcon, FileText } from "lucide-react";
import React, { useRef } from "react";

interface UploadFormProps {
  uploadMethod: "file" | "youtube";
  setUploadMethod: (method: "file" | "youtube") => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  onYoutubeSubmit: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  uploadMethod, setUploadMethod, onFileUpload,
  youtubeUrl, setYoutubeUrl, onYoutubeSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="quiz-card animate-scale-in bg-white">
      <CardHeader>
        <CardTitle className="font-poppins text-center">
          {uploadMethod === "file" ? "Upload Your Files" : "YouTube Lecture Link"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {uploadMethod === "file" ? (
          <div>
            <Label htmlFor="file-upload" className="block mb-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-quiz-purple transition-colors duration-200 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                aria-label="File upload drop zone"
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-quiz-text mb-2">
                  Drop your files here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports PDF, and text file upload 2MB(For now)
                </p>
              </div>
            </Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf,.txt"
              onChange={onFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Label htmlFor="youtube-url">YouTube Lecture URL</Label>
            <div className="flex gap-2">
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                className="quiz-input flex-1"
              />
              <Button
                onClick={onYoutubeSubmit}
                className="quiz-button"
                disabled={!youtubeUrl.trim()}
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-500 text-sm">
              Paste any YouTube lecture or educational video link
            </p>
          </div>
        )}
      </CardContent>
      <div className="flex justify-center p-2">
        <Button
          variant={uploadMethod === 'file' ? 'default' : 'ghost'}
          onClick={() => setUploadMethod('file')}
          className={uploadMethod === 'file' ? 'quiz-button' : ''}
        >
          <FileText className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
        <Button
          variant={uploadMethod === 'youtube' ? 'default' : 'ghost'}
          onClick={() => setUploadMethod('youtube')}
          className={uploadMethod === 'youtube' ? 'quiz-button' : ''}
        >
          <Youtube className="w-4 h-4 mr-2" />
          YouTube Link
        </Button>
      </div>
    </Card>
  );
};

export default UploadForm;
