import { Injectable } from '@nestjs/common';
import {
  ALLOWED_MIME_TYPES,
  AllowedMimeType,
  EntityType,
  MIMETYPE_RULES,
} from './mimetypes';

@Injectable()
export class MimeTypeService {
  isValidMimeType(mimetype: string, entitytype: EntityType) {
    return MIMETYPE_RULES[entitytype].includes(mimetype as AllowedMimeType);
  }

  getExtension(mimetype: string) {
    return ALLOWED_MIME_TYPES[mimetype];
  }
}
