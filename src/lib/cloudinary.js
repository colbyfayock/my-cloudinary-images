export async function search(options = {}) {
  const params = {
    ...options
  }

  if ( options.nextCursor ) {
    params.next_cursor = options.nextCursor
    delete params.nextCursor;
  }

  const paramString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');

  const results = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/search?${paramString}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ':' + process.env.CLOUDINARY_API_SECRET).toString('base64')}`
    }
  }).then(r => r.json());

  return results;
}

export function mapImageResources(resources) {
  return resources.map(resource => {
    const { width, height } = resource;
    return {
      id: resource.asset_id,
      title: resource.public_id,
      image: resource.secure_url,
      width,
      height
    }
  });
}