const checkNameUnique = async (id, name) => {
    const query = { is_deleted: { $ne: true } };

    if (id && id.length) {
        Object.assign(query, { _id: { $ne: id } });
    }

    if (name && name.length) {
        Object.assign(query, { name });
    }

    const namelExists = await Movie.findOne(query).lean();

    if (namelExists) {
        throw new Error('Bộ phim đã tồn tại!');
    }

    return true;
};
