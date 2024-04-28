import React, { useState, useEffect } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Modal,
    Paper
} from '@mui/material';
import DashboardCard from '../../../src/components/shared/DashboardCard';

interface Product {
    id: string;
    language: string | null;
    status: string | null;
    // Add more properties as needed
}

const ProductPerformance = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        fetch('http://localhost:8080/fhir/InsurancePlan') 
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.entry)) {
                    const extractedProducts = data.entry.map((entry: { resource: Product }) => {
                        const resource = entry.resource;
                        return {
                            id: resource.id,
                            language: resource.language,
                            status: resource.status,
                            // Add more columns as needed
                        };
                    });
                    setProducts(extractedProducts);
                } else {
                    console.error('Invalid data format:', data);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <DashboardCard title="Insurance Plan">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Id
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Language
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Status
                                </Typography>
                            </TableCell>
                            {/* Add more table headers for other columns */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(0, 5).map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Typography
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {product.id}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {product.language ?? 'NA'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {product.status ?? 'NA'}
                                    </Typography>
                                </TableCell>
                                {/* Add more table cells for other columns */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {products.length > 5 && (
                    <button onClick={handleOpenModal}>View More</button> // You can replace this with your popup or modal component
                )}
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="full-table-modal-title"
                aria-describedby="full-table-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        maxHeight: '80%',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="full-table-modal-title" variant="h6" component="h2">
                        Full Table
                    </Typography>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Id
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Language
                                        </Typography>
                                        {/* Add more table headers for other columns */}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Status
                                        </Typography>
                                        {/* Add more table headers for other columns */}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {product.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {product.language ?? 'NA'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {product.status ?? 'NA'}
                                            </Typography>
                                        </TableCell>
                                        {/* Add more table cells for other columns */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>
            </Modal>
        </DashboardCard>
    );
};

export default ProductPerformance;
