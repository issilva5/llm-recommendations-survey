export class JSONSet extends Set {
    toJSON () {
        return [...this]
    }

    add(o) {
        for (let i of this)
            if (i.imdbID === o.imdbID)
                return this
        return Set.prototype.add.call(this, o);
    };

}