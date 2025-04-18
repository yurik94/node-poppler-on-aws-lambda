# Use Amazon Linux 2023 as the base image
FROM amazonlinux:2023

# Define build argument and environment variable
ARG TARGET_PLATFORM
ENV TARGET_PLATFORM=${TARGET_PLATFORM}

# Set environment variable for the package directory
ENV PACKAGE_DIR=/package

# Install necessary packages, including Poppler utilities, data, and fonts
RUN dnf update -y \
    && dnf install -y \
       openjpeg2-devel \
       libjpeg-devel \
       fontconfig-devel \
       libtiff-devel \
       libpng-devel \
       gcc \
       gcc-c++ \
       zip \
       poppler-utils \
       poppler-data \
       freetype-devel \
       fontconfig \
       dejavu-sans-fonts \
       liberation-fonts \
    && dnf clean all

# Create the package directory structure
RUN mkdir -p ${PACKAGE_DIR}/bin ${PACKAGE_DIR}/lib ${PACKAGE_DIR}/share/poppler ${PACKAGE_DIR}/fonts ${PACKAGE_DIR}/etc/fonts

# Copy Poppler utilities (pdftocairo) into the package/bin directory
RUN cp /usr/bin/pdftocairo ${PACKAGE_DIR}/bin

# Identify and copy required libraries to the package/lib directory
RUN ldd /usr/bin/pdftocairo \
    | awk '{print $3}' \
    | grep '^/' \
    | while read -r lib; do \
        if [ -f "$lib" ]; then \
            cp -v "$lib" ${PACKAGE_DIR}/lib/; \
        else \
            echo "Warning: Library $lib not found."; \
        fi; \
    done

# Copy poppler-data files to the package directory
RUN cp -r /usr/share/poppler/* ${PACKAGE_DIR}/share/poppler/

# Copy font files to the package
RUN cp -r /usr/share/fonts/* ${PACKAGE_DIR}/fonts/

# Copy the local fonts.conf file to the desired location in the Lambda layer
COPY fonts.conf ${PACKAGE_DIR}/etc/fonts/fonts.conf

# Set appropriate permissions for /package/bin
RUN chmod 755 ${PACKAGE_DIR}/bin/*

# Zip the package for deployment
RUN cd ${PACKAGE_DIR} && zip -r9 /package.zip *

# Copy the zip file to the host machine with the specific naming convention
CMD cp /package.zip /workspace/poppler/release-${TARGET_PLATFORM}.zip
