import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config()
@Injectable()
export class WasabiService {
  private logger = new Logger(WasabiService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Configure your Wasabi bucket name and region via environment variables
    this.bucketName = "mydeploybucket";
    this.s3Client = new S3Client({
      region: "ap-northeast-1",
      endpoint: 'https://s3.ap-northeast-1.wasabisys.com',
      credentials: {
        accessKeyId: "N7VXRQ4X7SPY6HY8D70V",
        secretAccessKey:"lWzE2g4XFDSvvAd9sgfC3PtcfZfPmZ4q5QYsBLdj",
      },
    });
  }

  async uploadDirectoryToWasabi(directory: string, prefix: string): Promise<string> {
    // Retrieve all files from the given directory
    const files = this.getAllFiles(directory);
    for (const filePath of files) {
      const fileContent = fs.readFileSync(filePath);
      // Create a key that includes the provided prefix (for example, a subdomain)
      const relativePath = path.relative(directory, filePath);
      const key = `${prefix}/${relativePath}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileContent,
      });
      await this.s3Client.send(command);
      this.logger.log(`Uploaded ${key} to Wasabi bucket ${this.bucketName}`);
    }
    const deployedUrl =`'https://mydeploybucket.wasabisys.com'}/${prefix}/index.html`;
    return deployedUrl;
  }

  // Helper function to recursively list all files in a directory
  private getAllFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        this.getAllFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    });
    return fileList;
  }
}
