import { Pagination } from '@shopify/polaris'
import React from 'react'
import { LIMIT } from '../../const'

export default function PaginationTable({ onPrevious, onNext, index, type, total }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
            <Pagination
                onPrevious={onPrevious}
                onNext={onNext}
                hasNext
                label={`${index * LIMIT + 1}-${Math.min((index + 1) * LIMIT, total) || 0} of ${total ?? 0} ${type}`}
            />
        </div>
    )
}
